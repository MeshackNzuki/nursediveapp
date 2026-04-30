<?php

namespace App\Models\Nclex;

use Illuminate\Database\Eloquent\Model;

class CaseStudy extends Model
{
    protected $table = 'case_studies';

    protected $fillable = [
        'title',
        'content',
        'question_no',
        'sub_topic_id',
    ];

    public $timestamps = true;

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    // This material BELONGS TO a Question
    public function question()
    {
        // foreign key on this table, owner key on questions table
        return $this->belongsTo(Question::class, 'question_no', 'id');
    }
}