<?php

namespace App\Models\Nursing;

use Illuminate\Database\Eloquent\Model;

class SubTopic extends Model
{
    /**
     * A subtopic has many questions
     */
    public function questions()
    {
        return $this->hasMany(Question::class, 'sub_topic_id', 'id');
    }

    /**
     * A subtopic has many lessons
     */
    public function lesson()
    {
        return $this->hasOne(Lesson::class, 'sub_topic_id', 'id');
    }
}
