<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('source_product', 20);
            $table->string('exam_mode', 20)->nullable();
            $table->unsignedBigInteger('exam_id')->nullable();
            $table->unsignedBigInteger('question_id')->nullable();
            $table->string('issue_type', 50)->nullable();
            $table->text('message');
            $table->string('route')->nullable();
            $table->json('metadata')->nullable();
            $table->string('status', 20)->default('new');
            $table->timestamps();

            $table->index(['source_product', 'status']);
            $table->index('exam_mode');
            $table->index('exam_id');
            $table->index('question_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_feedback');
    }
};

