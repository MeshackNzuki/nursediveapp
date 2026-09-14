<?php

namespace App\Http\Controllers\Nclex;

use App\Models\Nclex\Topic;
use App\Models\Nclex\Category;
use App\Http\Controllers\Controller;
use App\Models\Nclex\SubTopic;
use Illuminate\Database\Eloquent\Builder;

class NclexTopicController extends Controller
{
    private const MAX_EXAM_YEAR = 2024;
    private const MAX_EXAM_QUESTIONS = 60;

    /**
     * Fetch all topics for a given subject.
     */
    // public function getTopicsByType($exam_type_id)
    // {
    //     $exam_type = ExamTypeID::find($exam_type_id);

    //     $topics = SubTopic::where('exam_type_id', $exam_type_id)
    //         ->orderBy('name', 'asc')
    //         ->get();

    //     return $this->ResSuccess(
    //         [
    //             'topics' => $topics,
    //             'subject' => $exam_type->name,
    //         ]
    //     );
    // }

    public function Readiness()

    {
        $topics = $this->eligibleSubtopicsQuery()
            ->where('exam_type_id', 1)
            ->orderBy('name', 'asc')
            ->get();

        return $this->ResSuccess(
            [
                'subtopics' => $topics,
            ]
        );
    }

    public function Mock()
    {
        $topics = $this->eligibleSubtopicsQuery()
            ->where('exam_type_id', 3)
            ->orderBy('name', 'asc')
            ->get();

        return $this->ResSuccess(
            [
                'subtopics' => $topics,
            ]
        );
    }

    private function eligibleSubtopicsQuery(): Builder
    {
        return SubTopic::query()
            ->has('questions', '<=', self::MAX_EXAM_QUESTIONS)
            ->where(function (Builder $query) {
                $query
                    ->whereNull('created_at')
                    ->orWhereYear('created_at', '<=', self::MAX_EXAM_YEAR);
            });
    }
}
