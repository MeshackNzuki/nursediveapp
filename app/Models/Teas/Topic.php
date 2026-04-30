<?php

namespace App\Models\Teas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use HasFactory;

    // Use TEAS database connection
    protected $connection = 'teas';

    // Table name
    protected $table = 'topics';

    // Mass assignable attributes
    protected $fillable = [
        'name',
        'slug',
        'description',
        'question_count',
        'image',
        'category_id',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'topic_id');
    }
    public function examAttempts()
    {
        return $this->hasMany(ExamAttempt::class, 'topic_id');
    }
}
