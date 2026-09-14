<?php

namespace App\Http\Controllers\Ai;

use App\Http\Controllers\Controller;

class OpenAIController extends Controller
{
    public function disabled()
    {
        return response()->json([
            'success' => false,
            'message' => 'The AI assistant is currently disabled.',
        ], 410);
    }
}
