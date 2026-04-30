<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class ExamDate extends Model
{
    protected $fillable = [
        'date',
        'product_code',
        'user_id',
    ];

    // Relationships (optional)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
