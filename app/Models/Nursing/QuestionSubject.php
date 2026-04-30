<?php

namespace App\Models\Nursing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class QuestionSubject extends Model
{
    use HasFactory;

    public function parentsubtopic()
    {
        return $this->belongsTo('App\Models\Nursing\ParentSubTopic', 'parent_sub_topic_id');
    }

    public function subtopics()
    {
        return $this->hasMany('App\Models\Nursing\SubTopic');
    }

    //transformers

    public function questionSubjectData()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
        ];
    }
}