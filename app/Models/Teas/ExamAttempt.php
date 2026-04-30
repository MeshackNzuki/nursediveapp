<?php


namespace App\Models\Teas;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;


class ExamAttempt extends Model
{

    protected $connection = 'teas';

    protected $fillable = [
        'topic_id',
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

    public function topic()
    {
        return $this->belongsTo(Topic::class, 'topic_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
