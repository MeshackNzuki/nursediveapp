<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExamDate;

class ExamDateController extends Controller
{


    // Create a new exam date
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'product_code' => 'required|string|max:255',
        ]);

        $validated['user_id'] = auth()->id();

        // Create or update if same user_id and product_code exist
        $examDate = ExamDate::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'product_code' => $validated['product_code'],
            ],
            [
                'date' => $validated['date'],
            ]
        );

        return $this->ResSuccess($examDate);
    }

    // Read all exam dates
    public function index(Request $request)
    {
        $validated = $request->validate([
            'product_code' => 'required|string|max:255',
        ]);

        $examDate = ExamDate::where('user_id', auth()->id())
            ->where('product_code', $validated['product_code'])
            ->first();

        return $this->ResSuccess($examDate);
    }

    // Read a single exam date
    public function show($id)
    {
        $examDate = ExamDate::findOrFail($id);
        return $this->ResSuccess($examDate);
    }
}
