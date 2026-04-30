<?php

namespace App\Http\Controllers\Nursing;

use App\Http\Controllers\Controller;
use App\Models\Nursing\ExamAttempt;
use Illuminate\Http\Request;

class MainNursingController extends Controller
{
    public function dashData(Request $request)
    {
        $userId = $request->user()->id;

        $attemptsCount = ExamAttempt::where('user_id', $userId)->count();
        $averageScore  = ExamAttempt::where('user_id', $userId)->avg('score');

        return $this->ResSuccess([
            'nursing_attempts' => $attemptsCount,
            'average_score'    => round($averageScore, 2), // keep 2 decimals
        ]);
    }
}
