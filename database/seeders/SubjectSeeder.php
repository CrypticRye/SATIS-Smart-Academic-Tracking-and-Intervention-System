<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Subject;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Default grade categories structure matching HasDefaultAssignments trait
        $defaultGradeCategories = [
            [
                'id' => 'written_works',
                'label' => 'Written Works',
                'weight' => 0.30,
                'tasks' => [],
            ],
            [
                'id' => 'performance_task',
                'label' => 'Performance Task',
                'weight' => 0.50,
                'tasks' => [],
            ],
            [
                'id' => 'quarterly_exam',
                'label' => 'Quarterly Exam',
                'weight' => 0.20,
                'tasks' => [],
            ],
        ];

        // 3 subjects/classlists matching the 3 sections we created students for
        $subjects = [
            [
                'name' => 'Physics',
                'grade_level' => 'Grade 12',
                'section' => 'STEM-A',
                'strand' => 'STEM',
                'track' => 'Academic',
                'color' => 'indigo',
                'user_id' => 1,
                'school_year' => '2025-2026',
                'grade_categories' => $defaultGradeCategories,
            ],
            [
                'name' => 'Business Mathematics',
                'grade_level' => 'Grade 11',
                'section' => 'ABM-B',
                'strand' => 'ABM',
                'track' => 'Academic',
                'color' => 'blue',
                'user_id' => 1,
                'school_year' => '2025-2026',
                'grade_categories' => $defaultGradeCategories,
            ],
            [
                'name' => 'Creative Writing',
                'grade_level' => 'Grade 11',
                'section' => 'HUMSS-A',
                'strand' => 'HUMSS',
                'track' => 'Academic',
                'color' => 'amber',
                'user_id' => 1,
                'school_year' => '2025-2026',
                'grade_categories' => $defaultGradeCategories,
            ],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}
