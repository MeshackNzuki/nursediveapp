<?php

namespace App\Models\Nursing;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class QuestionNote extends Model
{
    protected $fillable = [
        'user_id',
        'question_id',
        'note',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
