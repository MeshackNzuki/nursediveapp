<?php


namespace App\Models\Nursing;

use Illuminate\Database\Eloquent\Model;
use App\Models\Nursing\SubTopic;

class Question extends Model
{
    protected $fillable = ['exam_id', 'text', 'type', 'options', 'question_slug'];

    protected $casts = [
        'options' => 'array',
    ];

    public function subTopic()
    {
        return $this->belongsTo(SubTopic::class, 'sub_topic_id');
    }
    public function questionType()
    {
        return $this->belongsTo(QuestionType::class);
    }
}
