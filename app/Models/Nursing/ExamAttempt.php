<?php


namespace App\Models\Nursing;

use Illuminate\Database\Eloquent\Model;
use  App\Models\User;



class ExamAttempt extends Model
{
    protected $fillable = [
        'sub_topic_id',
        'user_id',
        'answers',
        'results',
        'score',
        'mode',
        'suspend_index',
        'completed',
        'notes',
        'completed_at',
        'time_taken',
    ];

    protected $casts = [
        'answers' => 'array',
        'results' => 'array',
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
