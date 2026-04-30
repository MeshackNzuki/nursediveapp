<?php

namespace App\Models\Nclex;

use Illuminate\Database\Eloquent\Model;

class QuestionType extends Model
{
    protected $connection = 'nclex';
    protected $table = 'question_types';
}