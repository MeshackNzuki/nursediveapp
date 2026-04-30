<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Nursing\Question;

class UpdateQuestionSlugs extends Command
{
    protected $signature = 'questions:update-slugs';
    protected $description = 'Bulk-update slugs for all questions with SEO-friendly full-word truncation, using CASE statement for speed.';

    protected int $maxLength = 75;
    protected array $trailingFillerWords = ['the', 'a', 'an', 'of', 'in', 'on', 'at', 'for', 'and', 'to'];

    public function handle(): int
    {
        $this->info("Starting ultra-fast slug update using CASE...");

        Question::chunk(500, function ($questions) {
            $cases = [];
            $ids = [];

            foreach ($questions as $q) {
                $plainText = trim(strip_tags($q->question));

                // Timestamp with milliseconds for uniqueness
                $timestamp = now()->format('ymdHisv');
                $availableLength = $this->maxLength - (strlen($timestamp) + 1);

                // Full-word truncation
                $words = explode(' ', $plainText);
                $slugWords = [];

                foreach ($words as $word) {
                    $candidate = $slugWords ? implode(' ', $slugWords) . ' ' . $word : $word;
                    if (strlen(Str::slug($candidate)) > $availableLength) break;
                    $slugWords[] = $word;
                }

                // Remove trailing filler words
                while ($slugWords && in_array(strtolower(end($slugWords)), $this->trailingFillerWords)) {
                    array_pop($slugWords);
                }

                // Slugify + append timestamp
                $baseSlug = Str::slug(implode(' ', $slugWords));
                $slug = "{$baseSlug}-{$timestamp}";

                $cases[] = "WHEN {$q->id} THEN '{$slug}'";
                $ids[] = $q->id;
            }

            if ($cases) {
                $idsStr = implode(',', $ids);
                $casesStr = implode(' ', $cases);

                $sql = "UPDATE questions SET question_slug = CASE id {$casesStr} END WHERE id IN ({$idsStr})";
                DB::statement($sql);

                echo count($ids) . " slugs updated in this chunk...\n";
            }
        });

        $this->info("✅ All question slugs updated ultra-fast with SEO-friendly logic.");
        return Command::SUCCESS;
    }
}
