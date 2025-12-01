<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;

class EnrollmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = Student::all();
        $subjects = Subject::all();

        foreach ($students as $student) {
            // Find the subject that matches the student's section
            $matchingSubject = $subjects->first(function ($subject) use ($student) {
                return $subject->section === $student->section &&
                    $subject->grade_level === $student->grade_level;
            });

            if ($matchingSubject) {
                Enrollment::create([
                    'user_id' => $student->user_id,
                    'subject_id' => $matchingSubject->id,
                    'risk_status' => 'low',
                    'current_grade' => null,
                    'current_attendance_rate' => null,
                ]);
            }
        }
    }
}
