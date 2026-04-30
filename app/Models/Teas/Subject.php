<?php

namespace App\Models\Teas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestSubject extends Model
{
    use HasFactory;

    // Use the TEAS database connection
    protected $connection = 'teas';

    // Table name
    protected $table = 'subjects';

    // Allow mass assignment
    protected $fillable = [
        'name',
        'slug',
        'created_at',
        'updated_at'
    ];

    // Disable timestamps if the table doesn't have them
    public $timestamps = true;
}
