<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Grade;
use App\Models\Intervention;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $teacher = Auth::user();

        // Get all enrollments for the teacher's subjects
        $enrollments = Enrollment::whereHas('subject', function ($query) use ($teacher) {
            $query->where('user_id', $teacher->id);
        })->with([
            'user',
            'grades',
            'student',
            'subject',
            'attendanceRecords',
            'intervention',
        ])->get();

        $students = $enrollments->map(function ($enrollment) {
            $averageGrade = $enrollment->grades->avg('score');
            $studentProfile = $enrollment->student;

            return [
                'id' => optional($studentProfile)->id ?? $enrollment->user->id,
                'first_name' => optional($studentProfile)->first_name ?? $enrollment->user->name,
                'last_name' => optional($studentProfile)->last_name ?? '',
                'avatar' => optional($studentProfile)->avatar,
                'subject' => optional($enrollment->subject)->name,
                'grade' => round($averageGrade),
                'trend' => optional($studentProfile)->trend,
                'enrollment_id' => $enrollment->id,
                'intervention' => $enrollment->intervention ? [
                    'id' => $enrollment->intervention->id,
                    'type' => $enrollment->intervention->type,
                    'status' => $enrollment->intervention->status,
                    'notes' => $enrollment->intervention->notes,
                ] : null,
            ];
        });

        // 1. Students at Risk
        $studentsAtRiskCount = $students->where('grade', '<', 75)->count();

        // 2. Average Grade
        $averageGrade = $students->avg('grade');

        // 3. Needs Attention
        $needsAttentionCount = $enrollments->filter(function ($enrollment) {
            return $enrollment->attendanceRecords->where('status', 'absent')->count() >= 2;
        })->count();

        // 4. Recent Declines
        $recentDeclinesCount = $students->where('trend', 'Declining')->count();

        // 5. Priority Students
        $criticalStudents = $students->where('grade', '<', 70);
        $warningStudents = $students->where('grade', '>=', 70)->where('grade', '<', 75);
        $watchListStudents = $students->where('grade', '>=', 75)->where('grade', '<', 80)->where('trend', 'Declining');

        // 6. Grade Distribution
        $gradeDistribution = [
            '90-100' => $students->where('grade', '>=', 90)->count(),
            '80-89' => $students->where('grade', '>=', 80)->where('grade', '<', 90)->count(),
            '75-79' => $students->where('grade', '>=', 75)->where('grade', '<', 80)->count(),
            '70-74' => $students->where('grade', '>=', 70)->where('grade', '<', 75)->count(),
            '<70' => $students->where('grade', '<', 70)->count(),
        ];

        // 7. Recent Activity
        $recentActivity = Intervention::whereIn('enrollment_id', $enrollments->pluck('id'))
            ->latest()->limit(5)->with('enrollment.user')->get();

        return Inertia::render('Teacher/Dashboard', [
            'stats' => [
                'studentsAtRisk' => $studentsAtRiskCount,
                'averageGrade' => round($averageGrade, 2),
                'needsAttention' => $needsAttentionCount,
                'recentDeclines' => $recentDeclinesCount,
            ],
            'priorityStudents' => [
                'critical' => $criticalStudents->values(),
                'warning' => $warningStudents->values(),
                'watchList' => $watchListStudents->values(),
            ],
            'gradeDistribution' => $gradeDistribution,
            'recentActivity' => $recentActivity,
        ]);
    }
}
