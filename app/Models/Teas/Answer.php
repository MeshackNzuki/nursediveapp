<?php

namespace App\Models\teas;

use App\Models\Teas\Question;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $connection = 'teas';
    use HasFactory;

    protected $table = 'answers';

    protected $casts = [
        'choices' => 'array',
    ];

    protected $fillable = [
        'choices',
        'correct_choice',
        'image',
        'explanation',
        'half_explanation',
        'description',
        'question_id',
    ];


    /**
     * An answer belongs to a question.
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
