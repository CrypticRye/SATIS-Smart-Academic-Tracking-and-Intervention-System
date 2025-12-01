<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Enrollment;
use App\Models\Grade;
use Illuminate\Support\Facades\DB;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $enrollments = Enrollment::all();
        $enrollmentCount = $enrollments->count();
        $index = 0;

        foreach ($enrollments as $enrollment) {
            $index++;

            // Determine student performance category
            // ~20% will be at-risk (low grades), ~20% will be struggling, rest will be normal/good
            $performanceType = 'good';
            if ($index <= $enrollmentCount * 0.15) {
                $performanceType = 'at_risk'; // Very low grades (< 70%)
            } elseif ($index <= $enrollmentCount * 0.30) {
                $performanceType = 'struggling'; // Low grades (70-75%)
            } elseif ($index <= $enrollmentCount * 0.50) {
                $performanceType = 'average'; // Average grades (75-85%)
            }

            // 3 Written Works (WW)
            for ($i = 1; $i <= 3; $i++) {
                $score = $this->generateScore(30, $performanceType, $i);
                Grade::create([
                    'enrollment_id' => $enrollment->id,
                    'assignment_key' => 'ww_' . $i,
                    'assignment_name' => "Written Work {$i}",
                    'score' => $score,
                    'total_score' => 30,
                    'quarter' => 1,
                ]);
            }

            // 3 Performance Tasks (PT)
            for ($i = 1; $i <= 3; $i++) {
                $score = $this->generateScore(50, $performanceType, $i);
                Grade::create([
                    'enrollment_id' => $enrollment->id,
                    'assignment_key' => 'pt_' . $i,
                    'assignment_name' => "Performance Task {$i}",
                    'score' => $score,
                    'total_score' => 50,
                    'quarter' => 1,
                ]);
            }

            // No Quarterly Exam grades for now as per request
        }
    }

    /**
     * Generate a score based on performance type
     */
    private function generateScore(int $totalScore, string $performanceType, int $assignmentIndex): int
    {
        $minPercent = match ($performanceType) {
            'at_risk' => 0.40,      // 40-65% range
            'struggling' => 0.65,   // 65-75% range
            'average' => 0.75,      // 75-85% range
            default => 0.80,        // 80-100% range (good students)
        };

        $maxPercent = match ($performanceType) {
            'at_risk' => 0.65,
            'struggling' => 0.75,
            'average' => 0.85,
            default => 1.0,
        };

        // Add some variation - some assignments might be missing (score = 0) for at-risk students
        if ($performanceType === 'at_risk' && rand(1, 10) <= 3) {
            return 0; // 30% chance of missing assignment for at-risk students
        }

        if ($performanceType === 'struggling' && rand(1, 10) <= 1) {
            return 0; // 10% chance of missing assignment for struggling students
        }

        $minScore = (int) ($totalScore * $minPercent);
        $maxScore = (int) ($totalScore * $maxPercent);

        return rand($minScore, $maxScore);
    }
}
