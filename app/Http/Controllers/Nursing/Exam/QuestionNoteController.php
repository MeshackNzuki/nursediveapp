<?php

namespace App\Http\Controllers\Nursing\Exam;

use App\Http\Controllers\Controller;
use App\Models\Nursing\Question;
use App\Models\Nursing\QuestionNote;
use Illuminate\Http\Request;

class QuestionNoteController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'question_ids' => ['sometimes', 'array'],
            'question_ids.*' => ['integer', 'exists:questions,id'],
        ]);

        $query = QuestionNote::query()
            ->where('user_id', $request->user()->id);

        if (!empty($validated['question_ids'])) {
            $query->whereIn('question_id', $validated['question_ids']);
        }

        return $this->ResSuccess(
            $query->pluck('note', 'question_id')->toArray()
        );
    }

    public function upsert(Request $request, Question $question)
    {
        $validated = $request->validate([
            'note' => ['nullable', 'string', 'max:20000'],
        ]);

        $note = $this->normalizeNote($validated['note'] ?? null);
        $userId = $request->user()->id;

        if ($note === null) {
            QuestionNote::query()
                ->where('user_id', $userId)
                ->where('question_id', $question->id)
                ->delete();

            return $this->ResSuccess([
                'question_id' => $question->id,
                'note' => null,
            ]);
        }

        $questionNote = QuestionNote::updateOrCreate(
            [
                'user_id' => $userId,
                'question_id' => $question->id,
            ],
            ['note' => $note]
        );

        return $this->ResSuccess([
            'question_id' => $questionNote->question_id,
            'note' => $questionNote->note,
        ]);
    }

    private function normalizeNote(?string $note): ?string
    {
        if ($note === null) {
            return null;
        }

        $plainText = trim(html_entity_decode(strip_tags($note), ENT_QUOTES | ENT_HTML5));

        return $plainText === '' ? null : $note;
    }
}
