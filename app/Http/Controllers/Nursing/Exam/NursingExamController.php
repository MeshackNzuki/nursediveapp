<?php

namespace App\Http\Controllers\Nursing\Exam;

use App\Models\Nursing\SubTopic;
use App\Models\Nursing\ExamAttempt;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Models\Nursing\ParentSubTopic;
use App\Models\Nursing\QuestionSubject;
use App\Models\User;
use Illuminate\Support\Carbon;



class NursingExamController extends Controller
{

    public function getSubjects()
    {
        $questionSubjects = QuestionSubject::all();
        return $this->ResSuccess(
            $questionSubjects
        );
    }

    public function getExamSubjects($slug)
    {
        $parentName = "";
        $questionSubjects = [];
        $status = false;

        $parentSubTopic = ParentSubTopic::where('slug', $slug)->first(['id', 'name', 'topic_id']);

        if (!$parentSubTopic) {
            throw new \Exception('Parent SubTopic not found');
        }

        $questionSubjects = QuestionSubject::with('subtopics')
            ->where('parent_sub_topic_id', $parentSubTopic->id)
            ->get()->map(function ($questionSubject) {
                $data = $questionSubject->questionSubjectData();
                $data['examsCount'] = isset($questionSubject->subtopics) ? $questionSubject->subtopics->count() : 0;
                return $data;
            });

        $topicName = isset($parentSubTopic->topic) ? $parentSubTopic->topic->name : "";
        $parentName = $topicName . " " . $parentSubTopic->name . " Exams";
        $status = true;

        return $this->ResSuccess([
            'status' => $status,
            "parentName" => $parentName,
            "exams" => $questionSubjects
        ]);
    }


    public function index()
    {
        $exams = SubTopic::all();

        if ($exams->isEmpty()) {
            return $this->ResError(
                'No exams found'
            );
        }

        return $this->ResSuccess(
            $exams
        );
    }

    public function showByTitle(Request $request, $id)
    {

        //Old gurds for trial and expiry
        // if ($nursing_sub[0]->plan_name == 'trial') {
        //     if (
        //         ExamAttempt::where('user_id', $request->user()->id)
        //         ->whereDate('created_at', Carbon::today())
        //         ->count() >= 2
        //     ) {
        //         return $this->ResError([
        //             'message' => 'daily_quota_reached',
        //             'details' => 'You have reached the maximum number of attempts for today.'
        //         ]);
        //     }
        // }
        // if (isset($nursing_sub[0]->expires) && Carbon::parse($nursing_sub[0]->expires)->isPast()) {
        //     return $this->ResError([
        //         'message' => 'subscription_expired',
        //         'details' => 'Your plan has expired. Please renew to continue.'
        //     ]);
        // }

        //new guard for expiry


        $exam = SubTopic::with('questions.questionType')->where('id', $id)->first();

        if (!$exam) {
            return $this->ResError('Exam not found');
        }

        // Filter the main exam fields
        $censoredExam = $exam->only([
            "id",
            "name",
            "slug",
            "topic_id",
            "parent_sub_topic_id",
            "question_subject_id",
            "created_at",
            "updated_at",
        ]);
        $censoredExam['questions'] = $exam->questions->map(function ($question) {
            return [
                "id" => $question->id,
                "question" => $question->question,
                "match_options" => $question->match_options,
                "match_option" => $question->match_option,
                "options" => $question->options,
                "question_type_id" => $question->question_type_id,
                "sub_topic_id" => $question->sub_topic_id,
                'tabs' => $question->tabs,
                "sub_sub_topic_id" => $question->sub_sub_topic_id,
                // "difficulty_level" => $question->difficulty_level,
                // "has_attachment" => $question->has_attachment,
                // "attachment_type" => $question->attachment_type,
                // "image_path" => $question->image_path,
                "question_slug" => $question->question_slug,
                "solution" => $question->solution,
                'correct_answer' => $question->correct_answer,
                // "result_data" => $question->result_data,
                "question_type" => [
                    "id" => $question->questionType?->id,
                    "name" => $question->questionType?->name,
                    "code" => $question->questionType?->code,
                ],

            ];
        });

        $censoredExam['full_length'] = $this->shouldTakeWholeExam($request);

        return $this->ResSuccess($censoredExam);
    }

    public function searchExamSubtopics(Request $request)
    {
        $searchTerm = $request->input('query');

        $examTopics = SubTopic::where('name', 'LIKE', '%' . $searchTerm . '%')
            ->get();
        return $this->ResSuccess($examTopics);
    }


    public function getSubtopicsPerSubject($slug, Request $request)
    {
        $questionSubject = QuestionSubject::where('slug', $slug)
            ->with(['parentsubtopic', 'subtopics'])
            ->first();

        if (!$questionSubject) {
            return $this->ResError('Subject not found');
        }

        return $this->ResSuccess(
            $questionSubject
        );
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sub_topic_id' => 'required|exists:sub_topics,id',
            'answers' => 'required|json',
            'results' => 'required|json',
            'score' => 'required|numeric|min:0|max:100',
            'mode' => 'required|in:exam,review,tutor',
            'completed_at' => 'required|date',
            'suspend_index' => 'required',
            'completed' => 'required|boolean',
            'time_taken' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        ExamAttempt::where('user_id', auth()->id())
            ->where('sub_topic_id', $request->sub_topic_id)
            ->delete();

        $attempt = ExamAttempt::create([
            'sub_topic_id'   => $request->sub_topic_id,
            'user_id'        => auth()->id(),
            'answers'        => json_encode($request->answers),
            'results'        => json_encode($request->results),
            'score'          => $request->score,
            'mode'           => $request->mode,
            'completed_at'   => $request->completed_at,
            'suspend_index'  => $request->suspend_index,
            'completed'      => $request->completed,
            'time_taken'     => $request->time_taken,
        ]);

        return $this->ResSuccess($attempt);
    }


    public function review_attempt(Request $request, $id)
    {
        $attempt = ExamAttempt::with('subTopic.questions.questionType')
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return $this->ResSuccess([
            'exam' => $attempt->subTopic,
            'sub_topic' => $attempt->subTopic,
            'questions' => $attempt->subTopic->questions,
            'answers' => json_decode($attempt->answers, true),
            'results' => json_decode($attempt->results, true),
            'score' => $attempt->score,
            'mode' => $attempt->mode,
            'completed_at' => $attempt->completed_at,
            'full_length' => $this->shouldTakeWholeExam($request),
        ]);
    }

    public function resume_attempt(Request $request, $id)
    {
        $attempt = ExamAttempt::with('subTopic.questions.questionType')
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();;

        return $this->ResSuccess([
            'exam' => $attempt->subTopic,
            'sub_topic' => $attempt->subTopic,
            'questions' => $attempt->subTopic->questions,
            'answers' => json_decode($attempt->answers, true),
            'results' => json_decode($attempt->results, true),
            'mode' => $attempt->mode,
            'suspend_index' => $attempt->suspend_index,
            'full_length' => $this->shouldTakeWholeExam($request),
        ]);
    }

    public function previous_attempts(Request $request)
    {
        $attempts = ExamAttempt::with('subTopic')
            ->where('user_id', auth()->id()) // Ensure user can only view their own
            ->get();
        return $this->ResSuccess(
            $attempts->map(function ($attempt) {
                return [
                    'id' => $attempt->id,
                    'sub_topic_id' => $attempt->sub_topic_id,
                    'sub_topic_name' => $attempt->subTopic->name,
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


    public function shouldTakeWholeExam($request)
    {
        $user = User::find($request->user()->id);

        $nursing_sub = json_decode($user->subscription->subscriptions)->nursing;


        if ($nursing_sub[0]->plan_name == 'trial' ||  Carbon::parse($nursing_sub[0]->expires)->isPast()) {
            if (
                ExamAttempt::where('user_id', $request->user()->id)
                ->count() >= 4
            ) {
                return false;
            }
        }
        if (isset($nursing_sub[0]->expires) && Carbon::parse($nursing_sub[0]->expires)->isPast()) {
            return false;
        }

        return true;
    }
}
