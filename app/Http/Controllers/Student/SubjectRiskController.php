<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Intervention;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubjectRiskController extends Controller
{
    /**
     * Display subjects at risk for the student.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get all enrollments with related data
        $enrollments = Enrollment::with([
            'subject.teacher',
            'grades',
            'attendanceRecords',
            'intervention.tasks',
        ])
            ->where('user_id', $user->id)
            ->get();

        // Process each enrollment to determine risk status
        $subjects = $enrollments->map(function ($enrollment) {
            $subject = $enrollment->subject;
            $grades = $enrollment->grades;
            $attendance = $enrollment->attendanceRecords;
            $intervention = $enrollment->intervention;

            // Calculate overall grade
            $totalScore = $grades->sum('score');
            $totalPossible = $grades->sum('total_score');
            $currentGrade = $totalPossible > 0
                ? round(($totalScore / $totalPossible) * 100, 1)
                : null;

            // Calculate attendance rate
            $totalDays = $attendance->count();
            $presentDays = $attendance->where('status', 'present')->count();
            $absentDays = $attendance->where('status', 'absent')->count();
            $lateDays = $attendance->where('status', 'late')->count();
            $attendanceRate = $totalDays > 0
                ? round(($presentDays / $totalDays) * 100, 1)
                : 100;

            // Group grades by category/type for breakdown
            $gradesByCategory = $grades->groupBy('category')->map(function ($categoryGrades) {
                $score = $categoryGrades->sum('score');
                $possible = $categoryGrades->sum('total_score');
                return [
                    'score' => $score,
                    'total' => $possible,
                    'percentage' => $possible > 0 ? round(($score / $possible) * 100, 1) : null,
                    'count' => $categoryGrades->count(),
                ];
            });

            // Group grades by quarter
            $gradesByQuarter = $grades->groupBy('quarter')->map(function ($quarterGrades) {
                $score = $quarterGrades->sum('score');
                $possible = $quarterGrades->sum('total_score');
                return [
                    'score' => $score,
                    'total' => $possible,
                    'percentage' => $possible > 0 ? round(($score / $possible) * 100, 1) : null,
                ];
            });

            // Calculate grade trend (compare recent grades to older ones)
            $recentGrades = $grades->sortByDesc('created_at')->take(5);
            $olderGrades = $grades->sortByDesc('created_at')->skip(5)->take(5);

            $recentAvg = $recentGrades->count() > 0
                ? ($recentGrades->sum('total_score') > 0
                    ? ($recentGrades->sum('score') / $recentGrades->sum('total_score')) * 100
                    : null)
                : null;

            $olderAvg = $olderGrades->count() > 0
                ? ($olderGrades->sum('total_score') > 0
                    ? ($olderGrades->sum('score') / $olderGrades->sum('total_score')) * 100
                    : null)
                : null;

            $trend = 'stable';
            if ($recentAvg !== null && $olderAvg !== null) {
                $diff = $recentAvg - $olderAvg;
                if ($diff > 5) $trend = 'improving';
                elseif ($diff < -5) $trend = 'declining';
            }

            // Determine risk level
            $riskLevel = 'low';
            $riskReasons = [];

            if ($currentGrade !== null) {
                if ($currentGrade < 70) {
                    $riskLevel = 'high';
                    $riskReasons[] = 'Grade below 70%';
                } elseif ($currentGrade < 75) {
                    $riskLevel = 'medium';
                    $riskReasons[] = 'Grade below passing (75%)';
                }
            }

            if ($attendanceRate < 80) {
                if ($riskLevel !== 'high') $riskLevel = 'high';
                $riskReasons[] = 'Attendance below 80%';
            } elseif ($attendanceRate < 90) {
                if ($riskLevel === 'low') $riskLevel = 'medium';
                $riskReasons[] = 'Attendance needs improvement';
            }

            // Check for low category scores
            foreach ($gradesByCategory as $category => $data) {
                if ($data['percentage'] !== null && $data['percentage'] < 70) {
                    if ($riskLevel === 'low') $riskLevel = 'medium';
                    $riskReasons[] = ucfirst($category) . ' score is low (' . $data['percentage'] . '%)';
                }
            }

            // Check for missing work (0 scores)
            $missingWork = $grades->where('score', 0)->count();
            if ($missingWork > 0) {
                if ($riskLevel === 'low') $riskLevel = 'medium';
                $riskReasons[] = $missingWork . ' missing assignment(s)';
            }

            if ($trend === 'declining') {
                if ($riskLevel === 'low') $riskLevel = 'medium';
                $riskReasons[] = 'Grade trend is declining';
            }

            // Calculate expected/projected grade based on current performance
            $expectedGrade = $currentGrade;
            if ($trend === 'declining' && $currentGrade !== null) {
                $expectedGrade = max(0, $currentGrade - 5);
            } elseif ($trend === 'improving' && $currentGrade !== null) {
                $expectedGrade = min(100, $currentGrade + 5);
            }

            // Get recent grade entries for display
            $recentGradeEntries = $grades->sortByDesc('created_at')->take(5)->map(fn($g) => [
                'id' => $g->id,
                'name' => $g->name,
                'category' => $g->category,
                'score' => $g->score,
                'totalScore' => $g->total_score,
                'percentage' => $g->total_score > 0 ? round(($g->score / $g->total_score) * 100, 1) : 0,
                'quarter' => $g->quarter,
                'date' => $g->created_at->format('M d'),
            ])->values();

            return [
                'id' => $enrollment->id,
                'subjectId' => $subject?->id,
                'subjectName' => $subject?->name ?? 'Unknown Subject',
                'section' => $subject?->section,
                'teacherName' => $subject?->teacher?->name ?? 'N/A',
                'currentGrade' => $currentGrade,
                'expectedGrade' => $expectedGrade !== null ? round($expectedGrade, 1) : null,
                'attendanceRate' => $attendanceRate,
                'totalClasses' => $totalDays,
                'presentDays' => $presentDays,
                'absentDays' => $absentDays,
                'lateDays' => $lateDays,
                'trend' => $trend,
                'riskLevel' => $riskLevel,
                'riskReasons' => $riskReasons,
                'missingWork' => $missingWork,
                'gradesByCategory' => $gradesByCategory,
                'gradesByQuarter' => $gradesByQuarter,
                'recentGrades' => $recentGradeEntries,
                'intervention' => $intervention ? [
                    'id' => $intervention->id,
                    'type' => $intervention->type,
                    'typeLabel' => Intervention::getTypes()[$intervention->type] ?? $intervention->type,
                    'status' => $intervention->status,
                    'notes' => $intervention->notes,
                    'createdAt' => $intervention->created_at->format('M d, Y'),
                    'tasks' => ($intervention->tasks ?? collect())->map(fn($t) => [
                        'id' => $t->id,
                        'description' => $t->description,
                        'isCompleted' => $t->is_completed,
                    ])->values(),
                ] : null,
            ];
        })
            ->sortBy(function ($subject) {
                // Sort by risk level (high first)
                $order = ['high' => 0, 'medium' => 1, 'low' => 2];
                return $order[$subject['riskLevel']] ?? 3;
            })
            ->values();

        // Calculate summary stats
        $highRiskCount = $subjects->where('riskLevel', 'high')->count();
        $mediumRiskCount = $subjects->where('riskLevel', 'medium')->count();
        $lowRiskCount = $subjects->where('riskLevel', 'low')->count();
        $atRiskSubjects = $subjects->whereIn('riskLevel', ['high', 'medium']);

        return Inertia::render('Student/SubjectRisk', [
            'subjects' => $subjects,
            'stats' => [
                'total' => $subjects->count(),
                'highRisk' => $highRiskCount,
                'mediumRisk' => $mediumRiskCount,
                'lowRisk' => $lowRiskCount,
                'atRiskCount' => $highRiskCount + $mediumRiskCount,
            ],
        ]);
    }
}
