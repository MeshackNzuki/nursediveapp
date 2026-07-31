<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('questions')) {
            return;
        }

        Schema::table('questions', function (Blueprint $table) {
            $table->index(['sub_topic_id', 'id'], 'questions_sub_topic_id_id_index');
        });

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement('ALTER TABLE `questions` ADD INDEX `questions_question_slug_prefix_index` (`question_slug`(191))');

            return;
        }

        Schema::table('questions', function (Blueprint $table) {
            $table->index('question_slug', 'questions_question_slug_index');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('questions')) {
            return;
        }

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement('ALTER TABLE `questions` DROP INDEX `questions_question_slug_prefix_index`');
        } else {
            Schema::table('questions', function (Blueprint $table) {
                $table->dropIndex('questions_question_slug_index');
            });
        }

        Schema::table('questions', function (Blueprint $table) {
            $table->dropIndex('questions_sub_topic_id_id_index');
        });
    }
};
