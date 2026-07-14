<?php

namespace App\Http\Controllers\Ai;

use App\Http\Controllers\Controller;
use App\Models\AiChat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class OpenAIController extends Controller
{
    private function responseIdCacheKey(int $userId, ?int $questionId): string
    {
        return 'openai_prev_response_id_' . $userId . '_' . ($questionId === null ? 'null' : $questionId);
    }

    private function clearStoredResponseId(int $userId, ?int $questionId): void
    {
        Cache::forget($this->responseIdCacheKey($userId, $questionId));

        try {
            $query = AiChat::query()->where('user_id', $userId);
            if ($questionId === null) {
                $query->whereNull('question_id');
            } else {
                $query->where('question_id', $questionId);
            }

            $query->update(['openai_response_id' => null]);
        } catch (Throwable $e) {
            report($e);
        }
    }

    public function incidentAssistantHistory(Request $request)
    {
        // The frontend expects this endpoint, but history persistence is currently disabled.
        return response()->json([
            'messages' => [],
        ]);
    }

    public function incidentAssistant(Request $request)
    {
        if (isset($request->isGradeAnswer) && $request->isGradeAnswer) {
            return $this->gradeAnswer($request);
        }

        $message    = trim((string) $request->input('message', ''));
        $questionId = $request->input('question_id');
        $questionId = is_numeric($questionId) ? (int) $questionId : null;

        $userId = optional($request->user())->id;

        $reasoning = $request->boolean('deep_reasoning') ? ['effort' => 'xhigh'] : ['effort' => 'medium'];

        if ($message === '') {
            return response()->stream(function () {
                echo "data: [DONE]\n\n";
                @ob_flush();
                flush();
            }, 200, [
                'Content-Type'      => 'text/event-stream',
                'Cache-Control'     => 'no-cache',
                'Connection'        => 'keep-alive',
                'X-Accel-Buffering' => 'no',
            ]);
        }

        return response()->stream(function () use ($message, $reasoning, $userId, $questionId) {

            while (ob_get_level() > 0) {
                ob_end_flush();
            }
            flush();

            $sendSafeDone = function (?string $fallbackText = null): void {
                if (is_string($fallbackText) && $fallbackText !== '') {
                    $safeText = str_replace(["\r\n", "\r", "\n"], "\ndata: ", $fallbackText);
                    echo "data: {$safeText}\n\n";
                }
                echo "data: [DONE]\n\n";
                @ob_flush();
                flush();
            };

            $apiKey = config('services.openai.key');

            if (empty($apiKey)) {
                $sendSafeDone("I am temporarily unavailable right now. Please try again shortly.");
                return;
            }

            $instructions = ' You are a strict and helpful Nursing school tutor and expert for a US nursing exam preparation platform called Nursedive (Nursedive.com).
                              Your role is to help nursing students understand nursing-style questions using strong clinical reasoning.
                                    Rules you must follow:
                                    1. Base your explanations primarily on the rationales provided with the question.
                                    2. Apply Nursing clinical reasoning frameworks when explaining answers (prioritization, ABCs, safety, Maslow, risk of complications etc).
                                    3. Do NOT hallucinate facts or invent medical information not supported by the question or rationale.
                                    4. If the question, answers, or rationales contain an error or inconsistency, acknowledge the issue and tell the user that
                                    the question has an error. tell them to report an incident so our team can review it.
                                    5. If the user asks about unrelated topics, avoid engaging and steer them politely to nursing related contexts
                                    6. If the user asks for human help or support, respond:
                                    "Please contact our support team at info@nursedive.com, or use the live chat on our website."
                                    7. Be concise, accurate, and educational. Focus on helping students learn the clinical reasoning behind answers.
                                    8. Tell them Why the Other Options Are Incorrect
                                    9. Do not generate questions for the client
                                    10.Do NOT use markdown headings like ###. Just write plain text bold with section labels
                                 Never break these rules.';

            try {
                $payload = [
                    'model'        => 'gpt-5.5',
                    'stream'       => true,
                    'instructions' => $instructions,
                    'input'        => $message,
                    'store'        => true,
                    'reasoning'    => $reasoning,
                ];

                $previousResponseId = $this->getOrStoreResponseId($userId, $questionId);

                if ($previousResponseId) {
                    $payload['previous_response_id'] = $previousResponseId;
                }

                $client = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type'  => 'application/json',
                    'Accept'        => 'text/event-stream',
                ])->withOptions([
                    'stream'  => true,
                    'timeout' => 300,
                ]);

                $response = $client->post('https://api.openai.com/v1/responses', $payload);

                if (! $response->ok()) {
                    $error     = $response->json('error') ?? null;
                    $errorCode = is_array($error) ? ($error['code'] ?? null) : null;

                    // If OpenAI no longer recognizes the previous response id (often due to key/project changes
                    // or deleted/expired server-side state), clear it and retry once without it.
                    if ($errorCode === 'previous_response_not_found' && isset($payload['previous_response_id']) && $userId !== null) {

                        $this->clearStoredResponseId($userId, $questionId);
                        unset($payload['previous_response_id']);

                        $response = $client->post('https://api.openai.com/v1/responses', $payload);
                    }
                }

                if (! $response->ok()) {
                    $sendSafeDone("I am having trouble answering right now. Please try again.");
                    return;
                }

                $body = $response->toPsrResponse()->getBody();

                $buffer = '';

                while (! $body->eof()) {
                    $buffer .= $body->read(1024);
                    while (($newlinePos = strpos($buffer, "\n")) !== false) {
                        $line   = trim(substr($buffer, 0, $newlinePos));
                        $buffer = substr($buffer, $newlinePos + 1);

                        if ($line === '' || strpos($line, 'data:') !== 0) {
                            continue;
                        }

                        $payload = trim(substr($line, 5));

                        if ($payload === '[DONE]') {
                            $sendSafeDone();
                            return;
                        }

                        $event = json_decode($payload, true);
                        if (! is_array($event)) {
                            continue;
                        }

                        //  Capture response ID and cache it
                        if (($event['type'] ?? null) === 'response.created') {
                            $responseId = $event['response']['id'] ?? null;
                            if ($responseId) {
                                $this->getOrStoreResponseId($userId, $questionId, $responseId);
                            }
                        }

                        if (($event['type'] ?? null) === 'error') {
                            $error     = $event['error'] ?? [];
                            $errorCode = $error['code'] ?? null;

                            if (in_array($errorCode, ['insufficient_quota', 'rate_limit_exceeded'])) {
                                $sendSafeDone("We’re currently unable to answer due to high demand. Please try again shortly.");
                                return;
                            }

                            $sendSafeDone("An error occurred. Please try again.");
                            return;
                        }

                        // Stream assistant text
                        if (($event['type'] ?? null) === 'response.output_text.delta') {
                            $delta = $event['delta'] ?? null;

                            if (is_string($delta) && $delta !== '') {
                                //  $assistantFullText .= $delta;
                                $safeText = str_replace(["\r\n", "\r", "\n"], "\ndata: ", $delta);
                                echo "data: {$safeText}\n\n";
                                @ob_flush();
                                flush();
                            }
                        }
                    }
                }

                // Fallback: persist if stream ended without explicit [DONE] event.
                // $persistAssistantMessage();
                $sendSafeDone();
            } catch (Throwable $e) {
                report($e);
                $sendSafeDone("I am having trouble answering right now. Please try again.");
            }
        }, 200, [
            'Content-Type'      => 'text/event-stream',
            'Cache-Control'     => 'no-cache',
            'Connection'        => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    public function getOrStoreResponseId(?int $userId, ?int $questionId = null, ?string $newResponseId = null, int $ttlHours = 24): ?string
    {
        if (! $userId) {
            return null;
        }

        $cacheKey = $this->responseIdCacheKey($userId, $questionId);

        // 1) If a new response id is provided, always persist it (cache + DB).
        if (is_string($newResponseId) && $newResponseId !== '') {
            Cache::put($cacheKey, $newResponseId, now()->addHours($ttlHours));

            try {
                if ($questionId === null) {
                    $aiChat = AiChat::query()
                        ->where('user_id', $userId)
                        ->whereNull('question_id')
                        ->orderByDesc('updated_at')
                        ->first();

                    if (! $aiChat) {
                        AiChat::query()->create([
                            'user_id'            => $userId,
                            'question_id'        => null,
                            'openai_response_id' => $newResponseId,
                        ]);

                        return $newResponseId;
                    }
                } else {
                    $aiChat = AiChat::query()->firstOrCreate([
                        'user_id'     => $userId,
                        'question_id' => $questionId,
                    ]);
                }

                if ($aiChat->openai_response_id !== $newResponseId) {
                    $aiChat->openai_response_id = $newResponseId;
                    $aiChat->save();
                }
            } catch (Throwable $e) {
                report($e);
            }

            return $newResponseId;
        }

        // 2) Try cache first.
        $cachedId = Cache::get($cacheKey);
        if (is_string($cachedId) && $cachedId !== '') {
            return $cachedId;
        }

        // 3) Fallback to DB and write back to cache.
        try {
            $aiChatQuery = AiChat::query()->where('user_id', $userId);
            if ($questionId === null) {
                $aiChatQuery->whereNull('question_id')->orderByDesc('updated_at');
            } else {
                $aiChatQuery->where('question_id', $questionId);
            }

            $aiChat = $aiChatQuery->first();
            $dbId   = $aiChat?->openai_response_id;
            if (is_string($dbId) && $dbId !== '') {
                Cache::put($cacheKey, $dbId, now()->addHours($ttlHours));
                return $dbId;
            }
        } catch (Throwable $e) {
            report($e);
        }
        return null;
    }
}
