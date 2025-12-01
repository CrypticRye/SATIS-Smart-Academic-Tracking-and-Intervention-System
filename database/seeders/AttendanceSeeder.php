<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Enrollment;
use App\Models\AttendanceRecord;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $enrollments = DB::table('enrollments')->get();

        foreach ($enrollments as $enrollment) {
            for ($i = 0; $i < 30; $i++) {
                AttendanceRecord::create([
                    'enrollment_id' => $enrollment->id,
                    'date' => Carbon::now()->subDays($i),
                    'status' => (rand(1, 100) <= 90) ? 'present' : 'absent',
                ]);
            }
        }
    }
}