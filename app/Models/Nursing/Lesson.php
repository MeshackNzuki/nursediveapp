<?php

namespace App\Models\Nursing;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = [
        'title',
        'body',
        'sub_topic_id',
        'sub_sub_topic_id',
        'difficulty_level_id',
        'preferences',
        'avg_read_time',
        'total_reads',
        'topic_id',
        'display_order',
    ];

    /**
     * A lesson belongs to a subtopic.
     * This is the ONLY authoritative relationship.
     */
    public function subtopic()
    {
        return $this->belongsTo(SubTopic::class, 'sub_topic_id', 'id');
    }
}
