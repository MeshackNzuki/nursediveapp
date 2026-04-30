<?php

namespace App\Http\Controllers\Teas;

use App\Models\Teas\Topic;
use App\Models\Teas\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Teas\ExamAttempt;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;


class TeasExamController extends Controller
{
    /**
     * Fetch all topics for a given subject.
     */
    public function showByTitle(Request $request, $id)
    {
        $user = $request->user();

        $full_length = true;


        $subscriptionData = json_decode(optional($user->subscription)->subscriptions ?? '{}');
        $teas_sub = $subscriptionData->teas ?? [];

        if (empty($teas_sub) || !isset($teas_sub[0])) {
            return $this->ResError([
                'message' => 'no_subscription',
                'details' => 'No valid TEAS subscription found.'
            ]);
        }
        $plan = $teas_sub[0];

        if ($plan->plan_name === 'trial' || Carbon::parse($plan->expires)->isPast()) {
            $attemptCount = ExamAttempt::where('user_id', $user->id)->count();
            if ($attemptCount >= 2) {
                $full_length = false;
            }
        }

        $exam = Topic::with('questions.answer')->where('id', $id)->first();

        if (!$exam) {
            return $this->ResError('Exam not found');
        }

        // Filter the main exam fields
        $censoredExam = $exam->only([
            "id",
            "name",
            "slug",
            "topic_id",
            "created_at",
            "updated_at",
        ]);

        // Question transformer for common frontend
        $censoredExam['questions'] = $exam->questions->map(function ($question) {

            $choices = $question->answer->choices;

            $formattedOptions = [];
            foreach ($choices as $key => $choice) {
                $formattedOptions[$key] = [
                    'choice' => $choice,
                    'reason' => null
                ];
            }

            return [
                "id" => $question->id,
                "question" => $question->question,
                "options" => $formattedOptions,
                "solution" => $question->answer->explanation,
                "correct_answer" => $question->answer->correct_choice,
                "question_type" => [
                    "code" => 'MSA'
                ],
            ];
        });

        $censoredExam['full_length'] = $full_length;

        return $this->ResSuccess($censoredExam);
    }


    public function store_attempt(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'topic_id' => 'required',
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

        // Ensure unique attempt per user per sub_topic
        ExamAttempt::where('user_id', auth()->id())
            ->where('topic_id', $request->sub_topic_id)
            ->delete();

        $attempt = ExamAttempt::create([
            'topic_id' => $request->topic_id,
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

    public function review_attempt(Request $request, $id)
    {
        $user = $request->user();
        $attempt = ExamAttempt::with('topic.questions.answer')
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $exam = $attempt->topic;

        $full_length = true;


        $subscriptionData = json_decode(optional($user->subscription)->subscriptions ?? '{}');
        $teas_sub = $subscriptionData->teas ?? [];

        if (empty($teas_sub) || !isset($teas_sub[0])) {
            return $this->ResError([
                'message' => 'no_subscription',
                'details' => 'No valid TEAS subscription found.'
            ]);
        }

        $plan = $teas_sub[0];

        if ($plan->plan_name === 'trial' || Carbon::parse($plan->expires)->isPast()) {
            $attemptCount = ExamAttempt::where('user_id', $user->id)->count();
            if ($attemptCount >= 2) {
                $full_length = false;
            }
        }



        // Filter the main exam fields
        $censoredExam = $exam->only([
            "id",
            "name",
            "slug",
            "topic_id",
            "created_at",
            "updated_at",
        ]);

        // Apply same transformer as showByTitle
        $questions = $exam->questions->map(function ($question) {
            $choices = $question->answer->choices;

            $formattedOptions = [];
            foreach ($choices as $key => $choice) {
                $formattedOptions[$key] = [
                    'choice' => $choice,
                    'reason' => null
                ];
            }

            return [
                "id" => $question->id,
                "question" => $question->question,
                "options" => $formattedOptions,
                "solution" => $question->answer->explanation,
                "correct_answer" => $question->answer->correct_choice,
                "question_type" => [
                    "code" => 'MSA'
                ],
            ];
        });

        // Attach transformed questions
        $censoredExam['questions'] = $questions;

        return $this->ResSuccess([
            'exam' => $censoredExam,
            'sub_topic' => $censoredExam,
            'questions' => $questions,
            'answers' => json_decode($attempt->answers, true),
            'results' => json_decode($attempt->results, true),
            'score' => $attempt->score,
            'mode' => $attempt->mode,
            'completed_at' => $attempt->completed_at,
            'time_taken' => $attempt->time_taken,
            'completed' => $attempt->completed,
            'full_length' => $full_length,
        ]);
    }


    public function resume_attempt($id)
    {
        $attempt = ExamAttempt::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return $this->ResSuccess([
            'topic_id' => $attempt->topic_id,
            'answers' => json_decode($attempt->answers, true),
            'results' => json_decode($attempt->results, true),
            'mode' => $attempt->mode,
            'suspend_index' => $attempt->suspend_index,
        ]);
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
        $attempt = ExamAttempt::with('topic')
            ->where('id', $attemptId)
            ->firstOrFail();

        return $this->ResSuccess([
            'exam' => $attempt->topic,
            'answers' => json_decode($attempt->answers, true),
            'results' => json_decode($attempt->results, true),
            'score' => $attempt->score,
            'mode' => $attempt->mode,
            'completed_at' => $attempt->completed_at,
            'sub_topic_id' => $attempt->sub_topic_id,
            'sub_topic_name' => $attempt->topic->name,
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
}