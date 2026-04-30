<?php

namespace App\Models\Nursing;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function subject()
    {
        return $this->belongsTo('App\Models\Nursing\Subject', 'subject_id');
    }
    public function questions()
    {
        return $this->hasMany('App\Models\Nursing\Question');
    }
    public function parentsubtopics()
    {
        return $this->hasMany('App\Models\Nursing\ParentSubTopic');
    }



    public function scopeSelectIdAndName($query)
    {
        return $query->select('id', 'name');
    }

    public function getTotalLessonsAttribute()
    {
        return $this->parentsubtopics->flatMap->lessons->count();
    }

    //
    public function topicData()
    {
        return [
            "name" => $this->name,
            "slug" => $this->slug
        ];
    }
}
