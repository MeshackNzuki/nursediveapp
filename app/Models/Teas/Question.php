<?php

namespace App\Models\Teas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    // Connection (if using TEAS database)
    protected $connection = 'teas';

    // Table name
    protected $table = 'questions';

    // Mass assignable fields
    protected $fillable = [
        'question',
        'description',
        'question_text',
        'question_slug',
        'image',
        'topic_id',
        'category_id',
        'more_explanation',
        'created_at',
        'updated_at',
    ];

    // Relationships
    public function topic()
    {
        return $this->belongsTo(Topic::class, 'topic_id');
    }

    public function answer()
    {
        return $this->hasOne(Answer::class, 'question_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
