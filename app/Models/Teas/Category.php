<?php

namespace App\Models\Teas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $connection = 'teas';

    // Mass assignable attributes
    protected $fillable = [
        'name',
        'slug',
        'section_id',
        'topic_id',
        'question_count',
        'type',
    ];

    // Relationships
    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
}
