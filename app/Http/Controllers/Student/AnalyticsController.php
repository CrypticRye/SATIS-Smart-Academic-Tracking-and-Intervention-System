<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    /**
     * Display the analytics index with all subjects and their grades.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get all enrollments for this student with related data
        $enrollments = Enrollment::with([
            'subject.teacher',
            'grades',
            'attendanceRecords',
            'intervention',
        ])
            ->where('user_id', $user->id)
            ->get();

        // Build subjects data with calculated grades
        $subjects = $enrollments->map(function ($enrollment) {
            $grades = $enrollment->grades;
            $totalScore = $grades->sum('score');
            $totalPossible = $grades->sum('total_score');
            $percentage = $totalPossible > 0 ? round(($totalScore / $totalPossible) * 100) : null;

            // Calculate attendance rate
            $attendance = $enrollment->attendanceRecords;
            $totalDays = $attendance->count();
            $presentDays = $attendance->whereIn('status', ['present', 'excused'])->count();
            $lateDays = $attendance->where('status', 'late')->count();
            $attendanceRate = $totalDays > 0
                ? round((($presentDays + ($lateDays * 0.5)) / $totalDays) * 100)
                : 100;

            // Determine status
            $status = 'good';
            if ($percentage !== null && $percentage < 70) {
                $status = 'critical';
            } elseif ($percentage !== null && $percentage < 75) {
                $status = 'warning';
            }

            return [
                'id' => $enrollment->id,
                'subjectId' => $enrollment->subject_id,
                'subject' => $enrollment->subject?->name ?? 'Unknown Subject',
                'teacher' => $enrollment->subject?->teacher?->name ?? 'N/A',
                'grade' => $percentage,
                'attendanceRate' => $attendanceRate,
                'status' => $status,
                'hasIntervention' => $enrollment->intervention !== null,
                'gradeCount' => $grades->count(),
            ];
        })->sortByDesc('grade')->values();

        // Calculate overall statistics
        $overallGrade = $subjects->whereNotNull('grade')->avg('grade');
        $overallGrade = $overallGrade ? round($overallGrade, 1) : null;

        $subjectsAtRisk = $subjects->filter(fn($s) => $s['grade'] !== null && $s['grade'] < 75)->count();

        return Inertia::render('Student/Analytics/Index', [
            'subjects' => $subjects,
            'stats' => [
                'overallGrade' => $overallGrade,
                'totalSubjects' => $subjects->count(),
                'subjectsAtRisk' => $subjectsAtRisk,
                'subjectsExcelling' => $subjects->filter(fn($s) => $s['grade'] !== null && $s['grade'] >= 90)->count(),
            ],
        ]);
    }

    /**
     * Display detailed analytics for a specific subject/enrollment.
     */
    public function show(Request $request, $enrollmentId): Response
    {
        $user = $request->user();

        // Get the specific enrollment with all related data
        $enrollment = Enrollment::with([
            'subject.teacher',
            'grades',
            'attendanceRecords',
            'intervention.tasks',
        ])
            ->where('user_id', $user->id)
            ->where('id', $enrollmentId)
            ->firstOrFail();

        $subject = $enrollment->subject;
        $grades = $enrollment->grades;

        // Calculate overall grade
        $totalScore = $grades->sum('score');
        $totalPossible = $grades->sum('total_score');
        $overallGrade = $totalPossible > 0 ? round(($totalScore / $totalPossible) * 100) : null;

        // Group grades by quarter
        $quarterlyData = $grades->groupBy('quarter')->map(function ($quarterGrades, $quarter) use ($enrollment) {
            $qScore = $quarterGrades->sum('score');
            $qTotal = $quarterGrades->sum('total_score');
            $qGrade = $qTotal > 0 ? round(($qScore / $qTotal) * 100) : null;

            // Get attendance for this quarter (approximate by date range)
            $attendance = $enrollment->attendanceRecords;
            $totalDays = $attendance->count();
            $presentDays = $attendance->whereIn('status', ['present', 'excused'])->count();
            $attendanceRate = $totalDays > 0 ? round(($presentDays / $totalDays) * 100) : 100;

            // Determine remarks
            $remarks = 'N/A';
            if ($qGrade !== null) {
                if ($qGrade >= 90) $remarks = 'Excellent';
                elseif ($qGrade >= 85) $remarks = 'Very Good';
                elseif ($qGrade >= 80) $remarks = 'Good';
                elseif ($qGrade >= 75) $remarks = 'Satisfactory';
                else $remarks = 'Needs Improvement';
            }

            return [
                'quarter' => "Q{$quarter}",
                'quarterNum' => $quarter,
                'grade' => $qGrade,
                'remarks' => $remarks,
                'attendance' => "{$attendanceRate}%",
                'assignmentCount' => $quarterGrades->count(),
            ];
        })->sortBy('quarterNum')->values();

        // Build grade breakdown by category/assignment
        $gradeBreakdown = $grades->map(function ($grade) {
            $percentage = $grade->total_score > 0
                ? round(($grade->score / $grade->total_score) * 100)
                : null;
            return [
                'id' => $grade->id,
                'name' => $grade->assignment_name,
                'key' => $grade->assignment_key,
                'score' => $grade->score,
                'totalScore' => $grade->total_score,
                'percentage' => $percentage,
                'quarter' => $grade->quarter,
                'createdAt' => $grade->created_at->format('M d, Y'),
            ];
        })->sortByDesc('created_at')->values();

        // Calculate attendance stats
        $attendanceRecords = $enrollment->attendanceRecords;
        $totalDays = $attendanceRecords->count();
        $presentDays = $attendanceRecords->where('status', 'present')->count();
        $absentDays = $attendanceRecords->where('status', 'absent')->count();
        $lateDays = $attendanceRecords->where('status', 'late')->count();
        $excusedDays = $attendanceRecords->where('status', 'excused')->count();
        $attendanceRate = $totalDays > 0
            ? round((($presentDays + $excusedDays + ($lateDays * 0.5)) / $totalDays) * 100)
            : 100;

        // Get intervention data (as feedback/notes)
        $intervention = $enrollment->intervention;
        $interventionData = null;
        if ($intervention) {
            $interventionData = [
                'id' => $intervention->id,
                'type' => $intervention->type,
                'typeLabel' => \App\Models\Intervention::getTypes()[$intervention->type] ?? $intervention->type,
                'status' => $intervention->status,
                'notes' => $intervention->notes,
                'tasks' => $intervention->tasks->map(fn($t) => [
                    'id' => $t->id,
                    'description' => $t->description,
                    'isCompleted' => $t->is_completed,
                ])->values(),
                'completedTasks' => $intervention->tasks->where('is_completed', true)->count(),
                'totalTasks' => $intervention->tasks->count(),
            ];
        }

        // Generate study suggestions based on performance
        $suggestions = $this->generateSuggestions($overallGrade, $attendanceRate, $gradeBreakdown);

        // Determine school year (from subject or current)
        $schoolYear = $subject?->school_year ?? date('Y') . '-' . (date('Y') + 1);

        return Inertia::render('Student/Analytics/Show', [
            'enrollment' => [
                'id' => $enrollment->id,
                'subjectId' => $enrollment->subject_id,
            ],
            'subject' => [
                'id' => $subject?->id,
                'name' => $subject?->name ?? 'Unknown Subject',
                'teacher' => $subject?->teacher?->name ?? 'N/A',
                'section' => $subject?->section,
                'schoolYear' => $schoolYear,
            ],
            'performance' => [
                'overallGrade' => $overallGrade,
                'quarterlyGrades' => $quarterlyData,
                'gradeBreakdown' => $gradeBreakdown,
            ],
            'attendance' => [
                'rate' => $attendanceRate,
                'totalDays' => $totalDays,
                'presentDays' => $presentDays,
                'absentDays' => $absentDays,
                'lateDays' => $lateDays,
                'excusedDays' => $excusedDays,
            ],
            'intervention' => $interventionData,
            'suggestions' => $suggestions,
        ]);
    }

    /**
     * Generate study suggestions based on performance.
     */
    private function generateSuggestions($grade, $attendanceRate, $gradeBreakdown)
    {
        $suggestions = [];

        // Grade-based suggestions
        if ($grade === null) {
            $suggestions[] = [
                'type' => 'info',
                'icon' => 'info',
                'title' => 'No Grades Yet',
                'message' => 'Your grades will appear here once your teacher starts recording them. Stay attentive in class!',
            ];
        } elseif ($grade >= 90) {
            $suggestions[] = [
                'type' => 'success',
                'icon' => 'star',
                'title' => 'Excellent Performance! ⭐',
                'message' => "You're doing amazing! Keep up the great work. Consider helping classmates who might be struggling.",
            ];
        } elseif ($grade >= 85) {
            $suggestions[] = [
                'type' => 'success',
                'icon' => 'thumbs-up',
                'title' => 'Great Job!',
                'message' => "You're performing very well. To reach excellent, try reviewing your notes for 15 minutes after each class.",
            ];
        } elseif ($grade >= 80) {
            $suggestions[] = [
                'type' => 'info',
                'icon' => 'lightbulb',
                'title' => 'Good Progress',
                'message' => "You're on the right track! Focus on understanding concepts deeply rather than just memorizing.",
            ];
        } elseif ($grade >= 75) {
            $suggestions[] = [
                'type' => 'warning',
                'icon' => 'alert',
                'title' => 'Room for Improvement',
                'message' => "You're passing but have room to grow. Consider forming a study group or visiting during office hours.",
            ];
        } else {
            $suggestions[] = [
                'type' => 'danger',
                'icon' => 'alert-triangle',
                'title' => 'Needs Attention',
                'message' => "Your grade is below passing. Please talk to your teacher as soon as possible for support and guidance.",
            ];
        }

        // Attendance-based suggestions
        if ($attendanceRate < 85) {
            $suggestions[] = [
                'type' => 'warning',
                'icon' => 'calendar',
                'title' => 'Improve Attendance',
                'message' => "Your attendance rate is {$attendanceRate}%. Regular attendance is crucial for success. Try to attend every class.",
            ];
        }

        // Check for low-scoring assignments
        $lowScoring = collect($gradeBreakdown)->filter(fn($g) => $g['percentage'] !== null && $g['percentage'] < 70);
        if ($lowScoring->count() > 0) {
            $suggestions[] = [
                'type' => 'info',
                'icon' => 'book',
                'title' => 'Review Past Work',
                'message' => "You have {$lowScoring->count()} assignment(s) below 70%. Review these topics to strengthen your understanding.",
            ];
        }

        return $suggestions;
    }
}
