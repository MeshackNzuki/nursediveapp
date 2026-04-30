<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'product_code',
        'duration_days',
        'price',
    ];

    protected $casts = [
        'duration_days' => 'integer',
        'price'         => 'float',
    ];

    public $timestamps = true;
}
