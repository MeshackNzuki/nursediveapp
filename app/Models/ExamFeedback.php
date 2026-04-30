<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamFeedback extends Model
{
    use HasFactory;

    protected $table = 'exam_feedback';

    protected $fillable = [
        'user_id',
        'source_product',
        'exam_mode',
        'exam_id',
        'question_id',
        'issue_type',
        'message',
        'route',
        'metadata',
        'status',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

