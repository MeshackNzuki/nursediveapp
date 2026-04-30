<?php

namespace App\Http\Controllers\Nursing\Study;

use App\Http\Controllers\Controller;
use App\Models\Nursing\SubTopic;
use App\Models\Nursing\Study\Chapter;
use App\Models\Nursing\Study\SubChapter;
use App\Models\Nursing\QuestionSubject;
use App\Models\Nursing\Topic;
use App\Models\Nursing\Lesson;
use App\Models\Nursing\ParentSubTopic;
use Illuminate\Http\Request;


class StudyController extends Controller
{
    // Fetch all chapters
    // public function getChapters()
    // {
    //     $chapters = Chapter::all();
    //     return $this->resSuccess($chapters);
    // }

    // Fetch topics for a specific chapter
    public function getChapters($id)
    {

        $topic = Topic::where('id', $id)->with('parentsubtopics')->first();
        return $this->resSuccess([
            'chapter_name' => $topic->name,
            'topics' => $topic->parentsubtopics,
            'id' => $id
        ]);
    }

    public function getSubtopicLessons($parent_sub_topic_id)
    {
        // Get all subtopics by parent_sub_topic_id
        $subtopics = SubTopic::where('parent_sub_topic_id', $parent_sub_topic_id)
            ->select([
                'id',
                'name',
                'parent_sub_topic_id',
                'questions_count',
                'display_order',
            ])
            ->orderBy('display_order', 'asc')
            ->get();


        // Loop through each subtopic and attach its lessons manually
        foreach ($subtopics as $subtopic) {
            $subtopic->lesson = $subtopic->lesson()->first() ?: null;
        }

        return $this->resSuccess([
            'parent_subtopic' => ParentSubTopic::find($parent_sub_topic_id),
            'subtopics'       => $subtopics,
        ]);
    }
}
