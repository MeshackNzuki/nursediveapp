<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Nursing\Question as NursingQuestion;
use App\Models\Teas\Question as TeasQuestion;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class QuestionIndexing extends Controller
{
    /**
     * Return nursing questions by slug.
     */
    public function indexNursingQuestions(Request $request)
    {
        $slug = $request->input('slug');

        if (!$slug) {
            return $this->ResError([
                'error' => 'Slug is required.'
            ], 400);
        }

        $question = NursingQuestion::where('question_slug', $slug)
            ->with('subTopic')
            ->first();

        if (!$question) {
            return $this->ResError([
                'message' => 'No nursing questions found for this slug.'
            ], 404);
        }

        $relatedQuestions = NursingQuestion::where('sub_topic_id', $question->sub_topic_id)
            ->where('id', '!=', $question->id)
            ->inRandomOrder()
            ->take(4)
            ->get();

        return $this->ResSuccess([
            'question' => $question,
            'related_questions' => $relatedQuestions
        ]);
    }


    /**
     * Return TEAS questions by slug.
     */
    public function indexTeasQuestions(Request $request)
    {
        $slug = $request->input('slug');

        if (!$slug) {
            return  $this->ResError([
                'error' => 'Slug is required.'
            ], 400);
        }

        $question = TeasQuestion::with('topic', 'answer')
            ->where('question_slug', $slug)
            ->first();

        if (!$question) {
            return $this->ResError([
                'message' => $slug
            ], 404);
        }

        $relatedQuestions = TeasQuestion::where('topic_id', $question->topic_id)
            ->where('id', '!=', $question->id)
            ->inRandomOrder()
            ->take(4)
            ->get();

        return $this->ResSuccess([
            'question' => $question,
            'related_questions' => $relatedQuestions
        ]);
    }

    public function linkGenerator()
    {
        try {
            // Nursing Questions
            NursingQuestion::chunkById(1000, function ($rows) {

                foreach ($rows as $q) {
                    try {
                        // Generate SEO-friendly slug from question
                        $base = Str::slug($q->question);

                        // Truncate at 60 chars without cutting words
                        $words = explode('-', $base);
                        $truncated = '';
                        foreach ($words as $word) {
                            if (strlen($truncated . ($truncated ? '-' : '') . $word) > 70) break;
                            $truncated .= ($truncated ? '-' : '') . $word;
                        }
                        $newSlug = $truncated;
                        $q->update(['question_slug' => $newSlug]);
                    } catch (\Exception $e) {
                        echo "❌ Error updating Nursing ID {$q->id}: " . $e->getMessage() . "\n";
                    }
                }

                echo "Processed Nursing chunk (IDs {$rows->first()->id} → {$rows->last()->id})\n";
            });

            // TEAS Questions
            TeasQuestion::chunkById(1000, function ($rows) {

                foreach ($rows as $q) {
                    try {
                        if (empty($q->question)) {
                            echo "⚠️ Skipping TEAS ID {$q->id}: question empty\n";
                            continue;
                        }

                        $base = Str::slug($q->question);

                        $words = explode('-', $base);
                        $truncated = '';
                        foreach ($words as $word) {
                            if (strlen($truncated . ($truncated ? '-' : '') . $word) > 70) break;
                            $truncated .= ($truncated ? '-' : '') . $word;
                        }

                        $newSlug = $truncated;

                        if ($q->question_slug !== $newSlug) {
                            $q->update(['question_slug' => $newSlug]);
                            echo "✅ Updated TEAS ID {$q->id} → {$newSlug}\n";
                        }
                    } catch (\Exception $e) {
                        echo "❌ Error updating TEAS ID {$q->id}: " . $e->getMessage() . "\n";
                    }
                }

                echo "Processed TEAS chunk (IDs {$rows->first()->id} → {$rows->last()->id})\n";
            });
        } catch (\Exception $e) {
            echo "❌ Fatal error: " . $e->getMessage() . "\n";
        }

        return "Slug update finished.";
    }

    //update subtopic slugs (linkGenerator)
    public function subtopicLinkGenerator()
    {
        try {
            // Nursing Subtopics
            \App\Models\Nursing\SubTopic::chunkById(100, function ($rows) {
                foreach ($rows as $sub) {
                    try {
                        $base = Str::slug($sub->name);
                        $words = explode('-', $base);
                        $truncated = '';
                        foreach ($words as $word) {
                            if (strlen($truncated . ($truncated ? '-' : '') . $word) > 70) break;
                            $truncated .= ($truncated ? '-' : '') . $word;
                        }
                        $newSlug = $truncated;
                        $sub->update(['slug' => $newSlug]);
                    } catch (\Exception $e) {
                        echo "❌ Error updating Nursing SubTopic ID {$sub->id}: " . $e->getMessage() . "\n";
                    }
                }
                echo "Processed Nursing SubTopic chunk (IDs {$rows->first()->id} → {$rows->last()->id})\n";
            });

            // TEAS Topics
            \App\Models\Teas\Topic::chunkById(100, function ($rows) {
                foreach ($rows as $topic) {
                    try {
                        if (empty($topic->name)) {
                            echo "⚠️ Skipping TEAS Topic ID {$topic->id}: name empty\n";
                            continue;
                        }

                        $base = Str::slug($topic->name);
                        $words = explode('-', $base);
                        $truncated = '';
                        foreach ($words as $word) {
                            if (strlen($truncated . ($truncated ? '-' : '') . $word) > 70) break;
                            $truncated .= ($truncated ? '-' : '') . $word;
                        }
                        $newSlug = $truncated;

                        if ($topic->slug !== $newSlug) {
                            $topic->update(['slug' => $newSlug]);
                            echo "✅ Updated TEAS Topic ID {$topic->id} → {$newSlug}\n";
                        }
                    } catch (\Exception $e) {
                        echo "❌ Error updating TEAS Topic ID {$topic->id}: " . $e->getMessage() . "\n";
                    }
                }
                echo "Processed TEAS Topic chunk (IDs {$rows->first()->id} → {$rows->last()->id})\n";
            });
        } catch (\Exception $e) {
            echo "❌ Fatal error: " . $e->getMessage() . "\n";
        }
    }

    public function sitemap()
    {
        $domain = 'https://www.nursedive.com';
        $chunkSize = 25000;

        $models = [
            'nursing' => NursingQuestion::select('id', 'question_slug', 'updated_at')->orderBy('id'),
            'teas'    => TeasQuestion::select('id', 'question_slug', 'updated_at')->orderBy('id'),
        ];

        foreach ($models as $type => $query) {
            try {
                $total = $query->count();
                $chunks = ceil($total / $chunkSize);

                for ($i = 0; $i < $chunks; $i++) {
                    $start = $i * $chunkSize;
                    $questions = $query->skip($start)->take($chunkSize)->get();

                    if ($questions->isEmpty()) continue;

                    $startId = $questions->first()->id;
                    $fileName = "{$type}_sitemap_{$startId}.xml";

                    $xmlContent = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
                    $xmlContent .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

                    foreach ($questions as $q) {
                        // Skip empty slugs just in case
                        if (empty($q->question_slug)) continue;

                        $lastMod = $q->updated_at ? $q->updated_at->toAtomString() : now()->toAtomString();

                        $xmlContent .= " <url>\n";
                        $xmlContent .= " <loc>{$domain}/questions/{$type}/{$q->question_slug}</loc>\n";
                        $xmlContent .= " <lastmod>{$lastMod}</lastmod>\n";
                        $xmlContent .= " <changefreq>weekly</changefreq>\n";
                        $xmlContent .= " </url>\n";
                    }

                    $xmlContent .= '</urlset>';

                    // Save sitemap to storage/app/sitemaps/
                    Storage::put("sitemaps/{$fileName}", $xmlContent);

                    echo "✅ Generated {$fileName} (IDs {$questions->first()->id} → {$questions->last()->id})\n";
                }
            } catch (\Exception $e) {
                echo "❌ Error generating {$type} sitemap: " . $e->getMessage() . "\n";
            }
        }

        return "✅ All sitemap chunks generated successfully!";
    }
}
