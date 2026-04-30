<?php

namespace App\Models\Nclex;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $connection = 'nclex';
    protected $table = 'subjects';
    protected $guarded = [];

    public function topics()
    {
        return $this->hasMany(Topic::class, 'subject_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'subject_id');
    }

    public function getRouteKeyName()
    {
        return 'id';
    }
}
