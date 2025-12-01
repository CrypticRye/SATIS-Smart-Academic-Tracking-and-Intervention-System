<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            if (! Schema::hasColumn('grades', 'assignment_key')) {
                $table->string('assignment_key')->nullable()->after('assignment_name');
            }

            $table->unique(['enrollment_id', 'assignment_key', 'quarter'], 'grades_assignment_unique');
        });

        DB::table('grades')
            ->select('id', 'assignment_name')
            ->orderBy('id')
            ->chunkById(500, function ($grades) {
                foreach ($grades as $grade) {
                    DB::table('grades')
                        ->where('id', $grade->id)
                        ->update([
                            'assignment_key' => Str::slug($grade->assignment_name ?? 'assignment', '_'),
                        ]);
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            $table->dropUnique('grades_assignment_unique');

            if (Schema::hasColumn('grades', 'assignment_key')) {
                $table->dropColumn('assignment_key');
            }
        });
    }
};
