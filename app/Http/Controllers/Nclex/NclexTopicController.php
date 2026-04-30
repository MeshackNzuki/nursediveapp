<?php

namespace App\Http\Controllers\Nclex;

use App\Models\Nclex\Topic;
use App\Models\Nclex\Category;
use App\Http\Controllers\Controller;
use App\Models\Nclex\SubTopic;

class NclexTopicController extends Controller
{
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
        $topics = SubTopic::where('exam_type_id', 1)
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
        $topics = SubTopic::where('exam_type_id', 3)
            ->orderBy('name', 'asc')
            ->get();

        return $this->ResSuccess(
            [
                'subtopics' => $topics,
            ]
        );
    }
}