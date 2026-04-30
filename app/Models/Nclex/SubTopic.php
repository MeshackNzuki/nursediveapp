<?php

namespace App\Models\Nclex;

use Illuminate\Database\Eloquent\Model;

class SubTopic extends Model
{
    protected $connection = 'nclex';

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}