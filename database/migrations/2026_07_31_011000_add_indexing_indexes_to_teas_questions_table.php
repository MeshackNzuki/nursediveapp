<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const CONNECTION = 'teas';

    public function up(): void
    {
        if (! Schema::connection(self::CONNECTION)->hasTable('questions')) {
            return;
        }

        Schema::connection(self::CONNECTION)->table('questions', function (Blueprint $table) {
            $table->index(['topic_id', 'id'], 'questions_topic_id_id_index');
        });

        if (in_array(DB::connection(self::CONNECTION)->getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::connection(self::CONNECTION)
                ->statement('ALTER TABLE `questions` ADD INDEX `questions_question_slug_prefix_index` (`question_slug`(191))');

            return;
        }

        Schema::connection(self::CONNECTION)->table('questions', function (Blueprint $table) {
            $table->index('question_slug', 'questions_question_slug_index');
        });
    }

    public function down(): void
    {
        if (! Schema::connection(self::CONNECTION)->hasTable('questions')) {
            return;
        }

        if (in_array(DB::connection(self::CONNECTION)->getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::connection(self::CONNECTION)
                ->statement('ALTER TABLE `questions` DROP INDEX `questions_question_slug_prefix_index`');
        } else {
            Schema::connection(self::CONNECTION)->table('questions', function (Blueprint $table) {
                $table->dropIndex('questions_question_slug_index');
            });
        }

        Schema::connection(self::CONNECTION)->table('questions', function (Blueprint $table) {
            $table->dropIndex('questions_topic_id_id_index');
        });
    }
};
