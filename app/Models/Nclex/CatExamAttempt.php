<?php

namespace App\Models\Nclex;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class CatExamAttempt extends Model
{
    protected $connection = 'nclex';
    protected $table = 'cat_exam_attempts';

    protected $fillable = [
        'sub_topic_id',
        'user_id',
        'answers',
        'results',
        'score',
        'mode',
        'suspend_index',
        'completed',
        'time_taken',
        'is_adaptive',
        'subject_scores',
        'sections',
        'theta',
        'final_difficulty',
        'final_level',
        'completed_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function subTopic()
    {
        return $this->belongsTo(SubTopic::class, 'sub_topic_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
