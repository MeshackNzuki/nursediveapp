<?php

namespace App\Http\Controllers\Teas;

use App\Models\Teas\Topic;
use App\Models\Teas\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class TeasTopicController extends Controller
{
    /**
     * Fetch all topics for a given subject.
     */
    public function getTopicsBySubject($categoryId)
    {
        $category = Category::find($categoryId);
        $topics = Topic::where('category_id', $categoryId)
            ->orderBy('name', 'asc')
            ->get();
        return $this->ResSuccess(
            [
                'topics' => $topics,
                'subject' => $category->name,

            ]
        );
    }

    public function getGuideChapters(Request $request)
    {
        $category = Category::where('slug', $request->slug)->firstOrFail();

        $topics = Topic::where('category_id', $category->id)
            ->orderBy('name', 'asc')
            ->get();

        return $this->ResSuccess([
            'topics' => $topics,
            'subject' => $category->name,
        ]);
    }
}
