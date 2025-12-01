<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'room_number',
        'school_year',
        'grade_level',
        'section',
        'strand',
        'track',
        'color',
        'grade_categories',
    ];

    protected $casts = [
        'grade_categories' => 'array',
    ];

    /**
     * Get the teacher (user) who owns this subject.
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Alias for teacher relationship.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->hasManyThrough(Student::class, Enrollment::class, 'subject_id', 'user_id', 'id', 'user_id');
    }
}
