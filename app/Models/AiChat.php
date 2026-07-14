<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class AiChat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'question_id',
        'openai_response_id',
    ];
}
