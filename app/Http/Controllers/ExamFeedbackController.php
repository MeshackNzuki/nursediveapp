<?php

namespace App\Http\Controllers;

use App\Models\ExamFeedback;
use Illuminate\Http\Request;

class ExamFeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'source_product' => 'required|string|in:nursing,teas,nclex,cat',
            'exam_mode' => 'nullable|string|in:exam,review,tutor',
            'exam_id' => 'nullable|integer|min:1',
            'question_id' => 'nullable|integer|min:1',
            'issue_type' => 'nullable|string|in:content_error,answer_issue,technical_issue,other',
            'message' => 'required|string|min:5|max:3000',
            'route' => 'nullable|string|max:255',
            'metadata' => 'nullable|array',
        ]);

        $feedback = ExamFeedback::create([
            'user_id' => $request->user()->id,
            'source_product' => $validated['source_product'],
            'exam_mode' => $validated['exam_mode'] ?? null,
            'exam_id' => $validated['exam_id'] ?? null,
            'question_id' => $validated['question_id'] ?? null,
            'issue_type' => $validated['issue_type'] ?? 'other',
            'message' => $validated['message'],
            'route' => $validated['route'] ?? null,
            'metadata' => $validated['metadata'] ?? null,
            'status' => 'new',
        ]);

        return $this->ResSuccess([
            'id' => $feedback->id,
            'message' => 'Feedback submitted successfully.',
        ], 201);
    }
}

