<?php

namespace App\Http\Controllers\Teas;

use App\Http\Controllers\Controller;
use App\Models\Teas\ExamAttempt;
use Illuminate\Http\Request;

class MainTeasController extends Controller
{
    public function dashData(Request $request)
    {
        $userId = $request->user()->id;

        $attemptsCount = ExamAttempt::where('user_id', $userId)->count();
        $averageScore  = ExamAttempt::where('user_id', $userId)->get();

        return $this->ResSuccess([
            'teas_attempts' => $attemptsCount,
            'average_score' => round($averageScore, 2), // rounded to 2 decimals
        ]);
    }
}
