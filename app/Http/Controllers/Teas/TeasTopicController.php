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

    /**
     * Search practice-test and study-guide topics by name (dashboard search).
     */
    public function searchTopics(Request $request)
    {
        $term = trim((string) $request->query('query', ''));
        if (mb_strlen($term) < 2) {
            return $this->ResSuccess([]);
        }

        $topics = Topic::with('category:id,name,slug')
            ->where('name', 'LIKE', '%' . $term . '%')
            ->orderBy('name')
            ->limit(30)
            ->get()
            ->map(function ($topic) {
                $slug = (string) ($topic->category?->slug ?? '');
                return [
                    'id'             => $topic->id,
                    'name'           => $topic->name,
                    'slug'           => $topic->slug,
                    'question_count' => $topic->question_count,
                    'category_id'    => $topic->category_id,
                    'category_name'  => $topic->category?->name,
                    'category_slug'  => $slug,
                    'kind'           => str_ends_with($slug, '_guide') ? 'guide' : 'exam',
                ];
            });

        return $this->ResSuccess($topics);
    }
}
