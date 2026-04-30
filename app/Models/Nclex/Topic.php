<?php

namespace App\Models\Nclex;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use HasFactory;
    protected $connection = 'nclex';

    protected $guarded = [];

    public function subject()
    {
        return $this->belongsTo('App\Models\Nclex\Subject', 'subject_id');
    }
    public function questions()
    {
        return $this->hasMany('App\Models\Nclex\Question');
    }
    public function parentsubtopics()
    {
        return $this->hasMany('App\Models\Nclex\ParentSubTopic');
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
