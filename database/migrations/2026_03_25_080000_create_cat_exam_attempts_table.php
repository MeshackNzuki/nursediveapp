<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('nclex')->create('cat_exam_attempts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('sub_topic_id');
            $table->longText('answers');
            $table->longText('results');
            $table->decimal('score', 8, 2);
            $table->string('mode', 32);
            $table->integer('suspend_index')->default(0);
            $table->boolean('completed')->default(false);
            $table->integer('time_taken')->default(0);
            $table->boolean('is_adaptive')->default(true);
            $table->longText('subject_scores')->nullable();
            $table->longText('sections')->nullable();
            $table->decimal('theta', 8, 4)->nullable();
            $table->decimal('final_difficulty', 8, 2)->nullable();
            $table->unsignedTinyInteger('final_level')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'sub_topic_id']);
        });
    }

    public function down(): void
    {
        Schema::connection('nclex')->dropIfExists('cat_exam_attempts');
    }
};
