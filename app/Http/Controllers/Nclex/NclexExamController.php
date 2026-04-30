<?php

namespace App\Http\Controllers\Nclex;

use App\Models\Nclex\CatExamAttempt;
use App\Models\Nclex\SubTopic;
use App\Models\Nclex\Subject;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Nclex\ExamAttempt;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;

class NclexExamController extends Controller
{
    private const MONTHLY_CAT_LIMIT = 3;

    /**
     * Fetch all topics for a given subject.
     */
    public function showByTitle($id)
    {

        $exam = SubTopic::with([
            'questions.questionType',
            'questions.caseStudy',
            'questions.subQuestions.questionType',
            'questions.subQuestions.caseStudy',
        ])->where('id', $id)->first();

        if (!$exam) {
            return $this->ResError('Exam not found');
        }

        if (!$this->canAccessNclexExam($exam)) {
            return $this->ResError('This NCLEX exam is locked.', 403);
        }

        // Filter the main exam fields
        $censoredExam = $exam->only([
            "id",
            "name",
            "slug",
            "trial_mode",
            "topic_id",
            "created_at",
            "updated_at",
        ]);

        $censoredExam['questions'] = $exam->questions->flatMap(function ($question) {

            $items = collect();

            /*
    |--------------------------------------------------------------------------
    | Parent Question
    |--------------------------------------------------------------------------
    */
            $choices = json_decode($question->choices, true) ?? [];

            $formattedOptions = [];
            foreach ($choices as $key => $value) {
                $formattedOptions[$key] = [
                    'choice' => $value,
                    'reason' => '',
                ];
            }
            $tabs = [];
            if ($question->caseStudy) {
                // Assume $question->caseStudy->content is already JSON array of {exhibit, body}
                $tabs = json_decode($question->caseStudy->content, true) ?? [];
            }

            $options = $formattedOptions;
            $correctAnswer = $question->correct_choice;

            if ($question->questionType?->code === 'DRD') {
                $options = $this->transformDRDOptions($formattedOptions);
                $correctAnswer = $this->transformDRDCorrectAnswer($question->correct_choice);
            }

            $items->push([
                "id" => $question->id,
                "is_sub" => false,
                "parent_id" => null,
                "intro" => $question->intro,
                "question" => $question->question,
                "table_header" => $question->table_header,
                "options" => $options,
                "correct_answer" => $correctAnswer,
                "mtx_option" => $question->mtx_option,
                "total_points" => $question->total_points,
                "solution" => $question->solution,
                "has_sub_questions" => $question->subQuestions->isNotEmpty(),
                "block_size" => 1 + $question->subQuestions->count(),
                "case_study_id" => $question->case_study_id,
                "tabs" => $question->caseStudy ?  json_encode(
                    collect(json_decode($question->caseStudy->content, true))
                        ->mapWithKeys(fn($item) => [$item['exhibit'] => $item['body']])
                        ->toArray()
                ) : null,
                "question_type" => [
                    "code" => $question->questionType?->code,
                ],
            ]);

            /*
    |--------------------------------------------------------------------------
    | Sub Questions (flattened directly after parent)
    |--------------------------------------------------------------------------
    */
            foreach ($question->subQuestions as $sub) {

                $choices = json_decode($sub->choices, true) ?? [];

                $formattedOptions = [];
                foreach ($choices as $key => $value) {
                    $formattedOptions[$key] = [
                        'choice' => $value,
                        'reason' => '',
                    ];
                }
                // For DRD sub-questions, we need to transform options and correct answer into a more usable format
                $options = $formattedOptions;
                $correctAnswer = $sub->correct_choice;

                if ($sub->questionType?->code === 'DRD') {
                    $options = $this->transformDRDOptions($formattedOptions);
                    $correctAnswer = $this->transformDRDCorrectAnswer($sub->correct_choice);
                }

                $items->push([
                    "id" => "sub_" . $sub->id, // prevent collision with main IDs
                    "is_sub" => true,
                    "parent_id" => $question->id,
                    "mtx_option" => $sub->mtx_option,
                    "table_header" => $sub->table_header,
                    "intro" => $sub->intro,
                    "question" => $sub->question_text,
                    "options" => $options,
                    "total_points" => $question->total_points,
                    "correct_answer" => $correctAnswer,
                    "solution" => $sub->solution,
                    "case_study_id" => $sub->case_study_id,
                    // "tabs" => $sub->caseStudy ? [
                    //     $sub->caseStudy->content,
                    // ] : null,
                    "tabs" =>
                    json_encode(
                        collect(json_decode($sub->caseStudy->content, true))
                            ->mapWithKeys(fn($item) => [$item['exhibit'] => $item['body']])
                            ->toArray()
                    ),
                    "question_type" => [
                        "code" => $sub->questionType?->code,
                    ],
                ]);
            }

            return $items;
        })->values();


        return $this->ResSuccess($censoredExam);
    }

    public function store_attempt(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sub_topic_id' => 'required',
            'answers' => 'required|json',
            'results' => 'required|json',
            'score' => 'required|numeric|min:0|max:100',
            'mode' => 'required|in:exam,review,tutor',
            'completed_at' => 'required|date',
            'suspend_index' => 'required',
            'completed' => 'required',
            'time_taken' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $subTopic = SubTopic::find($request->sub_topic_id);
        if (!$subTopic) {
            return $this->ResError('Exam not found');
        }

        if (!$this->canAccessNclexExam($subTopic)) {
            return $this->ResError('This NCLEX exam is locked.', 403);
        }

        // Ensure unique attempt per user per sub_topic
        ExamAttempt::where('user_id', auth()->id())
            ->where('sub_topic_id', $request->sub_topic_id)
            ->delete();

        $attempt = ExamAttempt::create([
            'sub_topic_id' => $request->sub_topic_id,
            'user_id' => auth()->id(),
            'answers' => json_encode($request->answers),
            'results' => json_encode($request->results),
            'score' => $request->score,
            'mode' => $request->mode,
            'completed_at' => $request->completed_at,
            'suspend_index' => $request->suspend_index,
            'completed' => $request->completed,
            'time_taken' => $request->time_taken,
        ]);

        return $this->ResSuccess(
            $attempt
        );
    }

    public function review_attempt($id)
    {
        $attempt = ExamAttempt::with('subTopic.questions.questionType')
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$attempt) {
            return $this->ResError('Exam not found');
        }

        // Structure to match the frontend
        $response = [
            'id' => $attempt->id,
            'sub_topic' => [
                'id' => $attempt->subTopic->id,
                'name' => $attempt->subTopic->name,
                'description' => $attempt->subTopic->description,
            ],
            'answers' => $attempt->answers, // already JSON in DB
            'results' => $attempt->results, // already JSON in DB
            'questions' => $attempt->subTopic->questions->map(function ($question) {
                $choices = json_decode($question->choices, true) ?? [];

                // Normalize to standardized format
                $formattedOptions = [];
                foreach ($choices as $key => $value) {
                    $formattedOptions[$key] = [
                        'choice' => $value,
                        'reason' => '', // blank placeholder for now
                    ];
                }

                return [
                    "id" => $question->id,
                    "intro" => $question->intro,
                    "question" => $question->question_text,
                    "options" => $formattedOptions,
                    "solution" => $question->solution,
                    "correct_answer" => $question->correct_choice,
                    "case_study_id" => $question->case_study_id,
                    "total_points" => $question->total_points,
                    "question_type" => [
                        "code" => $question->questionType?->code,
                    ],
                ];
            }),
        ];

        return $this->ResSuccess($response);
    }




    public function previous_attempts(Request $request)
    {
        $attempts = ExamAttempt::with('topic')
            ->where('user_id', auth()->id())
            ->get();
        return $this->ResSuccess(
            $attempts->map(function ($attempt) {
                return [
                    'id' => $attempt->id,
                    'sub_topic_id' => $attempt->topic_id,
                    'sub_topic_name' => $attempt->topic->name,
                    'score' => $attempt->score,
                    'mode' => $attempt->mode,
                    'completed_at' => $attempt->completed_at,
                    'suspend_index' => $attempt->suspend_index,
                    'time_taken' => $attempt->time_taken,
                    'completed' => $attempt->completed,
                    'attempt_id' => $attempt->id,
                    'created_at' => $attempt->created_at,
                    'updated_at' => $attempt->updated_at,
                ];
            })
        );
    }

    public function performance_report($attemptId)
    {
        $attempt = ExamAttempt::with('subTopic')
            ->where('id', $attemptId)
            ->firstOrFail();

        return $this->ResSuccess([
            'exam' => $attempt->subTopic,
            'answers' => json_decode($attempt->answers, true),
            'results' => json_decode($attempt->results, true),
            'score' => $attempt->score,
            'mode' => $attempt->mode,
            'completed_at' => $attempt->completed_at,
            'sub_topic_id' => $attempt->sub_topic_id,
            'sub_topic_name' => $attempt->subTopic->name,
            'score' => $attempt->score,
            'mode' => $attempt->mode,
            'suspend_index' => $attempt->suspend_index,
            'time_taken' => $attempt->time_taken,
            'completed' => $attempt->completed,
            'attempt_id' => $attempt->id,
            'created_at' => $attempt->created_at,
            'updated_at' => $attempt->updated_at,
        ]);
    }

    public function computerized_assessment()
    {
        //fetch all client ned araeas available
        $areas = SubTopic::all();
        //now for each area, fetch 10 qns

    }

    /**
     * Get adaptive CAT exam pool (questions grouped by subject)
     */
    public function getAdaptiveExam()
    {
        try {
            if ($this->hasReachedMonthlyCatLimit()) {
                return $this->ResError($this->monthlyCatLimitMessage(), 429);
            }

            $exam = SubTopic::with([
                'questions.questionType',
                'questions.caseStudy',
                'questions.subject',
            ])->where('slug', 'like', '%adaptive%')
                ->orWhere('name', 'like', '%CAT%')
                ->first();

            if (!$exam) {
                return $this->ResError('Adaptive exam pool not found. Please ensure "Adaptive CAT" subtopic exists.');
            }

            // Format questions with difficulty and subject mapping
            $questionItems = $exam->questions->map(function ($question) {
                $choices = json_decode($question->choices, true) ?? [];
                $formattedOptions = [];
                foreach ($choices as $key => $value) {
                    $formattedOptions[$key] = [
                        'choice' => $value,
                        'reason' => '',
                    ];
                }

                $options = $formattedOptions;
                $correctAnswer = $question->correct_choice;

                if ($question->questionType?->code === 'DRD') {
                    $options = $this->transformDRDOptions($formattedOptions);
                    $correctAnswer = $this->transformDRDCorrectAnswer($question->correct_choice);
                }

                $subjectId = (int) ($question->subject_id ?? 0);
                $subjectName = $question->subject?->name ?? 'Subject ' . $subjectId;

                return [
                    "id" => $question->id,
                    "intro" => $question->intro,
                    "question" => $question->question,
                    "options" => $options,
                    "correct_answer" => $correctAnswer,
                    "solution" => $question->solution,
                    "subject_id" => $subjectId,
                    "subject_name" => $subjectName,
                    "level_id" => $question->level_id ?? $question->difficulty ?? 2,
                    "difficulty" => $question->difficulty ?? ($question->level_id ?? 2),
                    "total_points" => $question->total_points ?? 1,
                    "question_type" => [
                        "code" => $question->questionType?->code,
                    ],
                ];
            });

            // Group by subject_id (title by subject name if available)
            $grouped = [];
            foreach ($questionItems as $item) {
                $subjectId = (int) ($item['subject_id'] ?? 0);
                $subjectName = $item['subject_name'] ?? 'Subject ' . $subjectId;

                if (!isset($grouped[$subjectId])) {
                    $grouped[$subjectId] = [
                        'subject_id' => $subjectId,
                        'title' => $subjectName,
                        'questions' => [],
                    ];
                }

                $grouped[$subjectId]['questions'][] = $item;
            }

            return $this->ResSuccess([
                'id' => $exam->id,
                'name' => $exam->name,
                'description' => $exam->description,
                'questions' => $grouped,
            ]);
        } catch (\Exception $e) {
            return $this->ResError('Error loading adaptive exam: ' . $e->getMessage());
        }
    }
    /**
     * Store CAT exam attempt with adaptive metrics
     */
    public function storeCATAttempt(Request $request)
    {
        if ($this->hasReachedMonthlyCatLimit()) {
            return $this->ResError($this->monthlyCatLimitMessage(), 429);
        }

        $validator = Validator::make($request->all(), [
            'sub_topic_id' => 'required',
            'answers' => 'required',
            'results' => 'required',
            'score' => 'required|numeric|min:0|max:100',
            'mode' => 'required|in:exam,review,tutor',
            'completed_at' => 'required|date',
            'suspend_index' => 'required',
            'completed' => 'required',
            'time_taken' => 'required|integer|min:0',
            'is_adaptive' => 'boolean',
            'subject_scores' => 'nullable',
            'sections' => 'nullable',
            'theta' => 'nullable|numeric',
            'final_difficulty' => 'nullable|numeric',
            'final_level' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $attempt = CatExamAttempt::create([
                'sub_topic_id' => $request->sub_topic_id,
                'user_id' => auth()->id(),
                'answers' => $this->coerceToJsonString($request->answers),
                'results' => $this->coerceToJsonString($request->results),
                'score' => $request->score,
                'mode' => $request->mode,
                'completed_at' => $request->completed_at,
                'suspend_index' => $request->suspend_index,
                'completed' => $request->completed,
                'time_taken' => $request->time_taken,
                'is_adaptive' => $request->boolean('is_adaptive', true),
                'subject_scores' => $this->coerceToJsonString($request->input('subject_scores')),
                'sections' => $this->coerceToJsonString($request->input('sections')),
                'theta' => $request->input('theta'),
                'final_difficulty' => $request->input('final_difficulty'),
                'final_level' => $request->input('final_level'),
            ]);

            return $this->ResSuccess($attempt);
        } catch (\Exception $e) {
            return $this->ResError('Error saving CAT attempt: ' . $e->getMessage());
        }
    }

    /**
     * Get all CAT attempts for current user
     */
    public function getCATAttempts()
    {
        try {
            $attempts = CatExamAttempt::where('user_id', auth()->id())
                ->orderByDesc('created_at')
                ->get();

            return $this->ResSuccess(
                $attempts->map(function ($attempt) {
                    return [
                        'id' => $attempt->id,
                        'sub_topic_id' => $attempt->sub_topic_id,
                        'score' => $attempt->score,
                        'mode' => $attempt->mode,
                        'completed_at' => $attempt->completed_at,
                        'suspend_index' => $attempt->suspend_index,
                        'time_taken' => $attempt->time_taken,
                        'completed' => $attempt->completed,
                        'theta' => $attempt->theta,
                        'final_difficulty' => $attempt->final_difficulty,
                        'final_level' => $attempt->final_level,
                        'created_at' => $attempt->created_at,
                        'updated_at' => $attempt->updated_at,
                    ];
                })
            );
        } catch (\Exception $e) {
            return $this->ResError('Error fetching CAT attempts: ' . $e->getMessage());
        }
    }

    /**
     * Get single CAT attempt with full details
     */
    public function getCATAttempt($id)
    {
        try {
            $attempt = CatExamAttempt::with('subTopic')
                ->where('id', $id)
                ->where('user_id', auth()->id())
                ->first();

            if (!$attempt) {
                return $this->ResError('CAT attempt not found');
            }

            $subjectNameMap = $this->buildSubjectNameMapFromAttempt($attempt);

            return $this->ResSuccess([
                'id' => $attempt->id,
                'sub_topic_id' => $attempt->sub_topic_id,
                'score' => $attempt->score,
                'mode' => $attempt->mode,
                'completed_at' => $attempt->completed_at,
                'suspend_index' => $attempt->suspend_index,
                'time_taken' => $attempt->time_taken,
                'completed' => $attempt->completed,
                'theta' => $attempt->theta,
                'final_difficulty' => $attempt->final_difficulty,
                'final_level' => $attempt->final_level,
                'subject_scores' => $attempt->subject_scores,
                'sections' => $attempt->sections,
                'subject_name_map' => $subjectNameMap,
                'answers' => json_decode($attempt->answers, true),
                'results' => json_decode($attempt->results, true),
                'created_at' => $attempt->created_at,
                'updated_at' => $attempt->updated_at,
            ]);
        } catch (\Exception $e) {
            return $this->ResError('Error fetching CAT attempt: ' . $e->getMessage());
        }
    }

    private function coerceToJsonString($value): ?string
    {
        if (is_null($value)) {
            return null;
        }

        if (is_string($value)) {
            return $value;
        }

        return json_encode($value);
    }

    private function buildSubjectNameMapFromAttempt(CatExamAttempt $attempt): array
    {
        $subjectIds = array_merge(
            $this->extractSubjectIdsFromPayload($attempt->sections),
            $this->extractSubjectIdsFromPayload($attempt->subject_scores)
        );

        $subjectIds = array_values(array_unique(array_filter(array_map('intval', $subjectIds))));
        if (empty($subjectIds)) {
            return [];
        }

        return Subject::query()
            ->whereIn('id', $subjectIds)
            ->pluck('name', 'id')
            ->toArray();
    }

    private function extractSubjectIdsFromPayload($payload): array
    {
        $decoded = $this->decodeJsonPayload($payload);
        if (!is_array($decoded)) {
            return [];
        }

        $subjectIds = [];
        foreach ($decoded as $key => $entry) {
            if (is_numeric($key)) {
                $subjectIds[] = (int) $key;
            }

            if (is_array($entry)) {
                $entryId = (int) ($entry['subject_id'] ?? $entry['id'] ?? 0);
                if ($entryId > 0) {
                    $subjectIds[] = $entryId;
                }
            }
        }

        return array_values(array_unique(array_filter($subjectIds, fn($id) => $id > 0)));
    }

    private function decodeJsonPayload($payload)
    {
        if (is_array($payload)) {
            return $payload;
        }

        if (is_string($payload)) {
            $decoded = json_decode($payload, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $decoded;
            }
        }

        return null;
    }

    private function canAccessNclexExam(SubTopic $subTopic): bool
    {
        if ((int) ($subTopic->trial_mode ?? 0) === 1) {
            return true;
        }

        return $this->hasActiveNclexPlan();
    }

    private function hasActiveNclexPlan(): bool
    {
        $user = auth()->user();
        if (!$user) {
            return false;
        }

        $subscriptions = optional($user->subscription)->subscriptions;
        if (is_string($subscriptions)) {
            $subscriptions = json_decode($subscriptions, true) ?? [];
        }

        if (!is_array($subscriptions)) {
            return false;
        }

        $nclexPlans = $subscriptions['nclex'] ?? [];
        if (!is_array($nclexPlans)) {
            return false;
        }

        $validPlans = ['premium', 'standard', 'premium_plus'];

        foreach ($nclexPlans as $plan) {
            if (!is_array($plan)) {
                continue;
            }

            $planName = strtolower((string) ($plan['plan_name'] ?? $plan['name'] ?? ''));
            $expires = $plan['expires'] ?? null;

            if (!in_array($planName, $validPlans, true) || !$expires) {
                continue;
            }

            if (Carbon::parse($expires)->endOfDay()->isFuture()) {
                return true;
            }
        }

        return false;
    }

    private function hasReachedMonthlyCatLimit(): bool
    {
        $count = CatExamAttempt::query()
            ->where('user_id', auth()->id())
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->count();

        return $count >= self::MONTHLY_CAT_LIMIT;
    }

    private function monthlyCatLimitMessage(): string
    {
        return 'You can only take the CAT exam 3 times per month. Please wait until next month.';
    }


    private function transformDRDOptions($options)
    {
        // Already correct format
        if (!is_array($options)) {
            return $options;
        }

        // If it is not the NCLEX format, leave untouched
        if (!isset($options[0]['choice']['id'])) {
            return $options;
        }

        $normalized = [];

        foreach ($options as $item) {
            $groupId = $item['choice']['id'];
            $choices = $item['choice']['options'] ?? [];

            $normalized[$groupId] = array_filter(
                $choices,
                fn($v) => $v !== null
            );
        }

        return $normalized;
    }

    private function transformDRDCorrectAnswer($answer)
    {
        if (!$answer) return $answer;

        if (is_string($answer)) {
            $decoded = json_decode($answer, true);

            if (is_array($decoded) && isset($decoded[0]['id'])) {
                $normalized = [];

                foreach ($decoded as $row) {
                    $normalized[$row['id']] = $row['answer'];
                }

                return $normalized;
            }
        }

        return $answer;
    }
}
