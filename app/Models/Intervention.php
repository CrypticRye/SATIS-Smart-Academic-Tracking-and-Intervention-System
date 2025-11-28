<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Intervention extends Model
{
    protected $fillable = [
        'enrollment_id', // or 'student_id' depending on your relationship setup
        'type',
        'status',
        'notes',
    ];

    // Optional: Helper to get readable names
    public static function getTypes()
    {
        return [
            'academic_quiz' => 'Tier 1: Remedial Quiz',
            'automated_nudge' => 'Tier 1: Automated Nudge',
            'task_list' => 'Tier 2: Goal Checklist',
            'extension_grant' => 'Tier 2: Grant Extension',
            'parent_contact' => 'Tier 2: Parent Contact',
            'counselor_referral' => 'Tier 3: Counselor Referral',
        ];
    }
}
