<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Intervention extends Model
{
    protected $fillable = [
        'enrollment_id',
        'type',
        'status',
        'notes',
    ];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function tasks()
    {
        return $this->hasMany(InterventionTask::class);
    }

    // Optional: Helper to get readable names
    public static function getTypes()
    {
        return [
            'automated_nudge' => 'Tier 1: Reminder Nudge',
            'task_list' => 'Tier 2: Goal Checklist',
            'extension_grant' => 'Tier 2: Deadline Extension',
            'parent_contact' => 'Tier 2: Parent Contact',
            'academic_agreement' => 'Tier 3: Academic Agreement',
            'one_on_one_meeting' => 'Tier 3: One-on-One Meeting',
        ];
    }
}
