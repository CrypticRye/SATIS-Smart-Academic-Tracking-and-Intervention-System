<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'enrollment_id',
        'assignment_key',
        'assignment_name',
        'score',
        'total_score',
        'quarter',
    ];

    protected $casts = [
        'score' => 'float',
        'total_score' => 'float',
        'quarter' => 'integer',
    ];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }
}
