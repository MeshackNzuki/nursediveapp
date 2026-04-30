<?php


namespace App\Models\Nclex;

use Illuminate\Database\Eloquent\Model;
use App\Models\Nclex\SubTopic;

class SubQuestion extends Model
{

    protected $connection = 'nclex';

    protected $fillable = ['exam_id', 'text', 'type', 'options'];

    protected $casts = [
        'options' => 'array',
    ];

    public function exam()
    {
        return $this->belongsTo(SubTopic::class);
    }
    public function questionType()
    {
        return $this->belongsTo(QuestionType::class, 'type_id');
    }

    public function caseStudy()
    {
        return $this->belongsTo(CaseStudy::class, 'case_study_id', 'id');
    }

    public function subQuestions()
    {
        return $this->hasMany(SubQuestion::class, 'question_id', 'id');
    }
}