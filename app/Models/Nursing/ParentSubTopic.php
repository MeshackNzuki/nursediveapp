<?php

namespace App\Models\Nursing;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentSubTopic extends Model
{


    protected $guarded = [];

    public function topic()
    {
        return $this->belongsTo('App\Models\Nursing\Topic', 'topic_id');
    }

    // public function subtopics()
    // {
    //     return $this->hasMany('App\Models\Nursing\SubTopic')
    //         ->where('type_id', 1);
    // }

    public function questionsubjects()
    {
        return $this->hasMany('App\Models\Nursing\QuestionSubject');
    }

    //transformers

    public function parentSubtopicData()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
        ];
    }
}