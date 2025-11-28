<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('interventions', function (Blueprint $table) {
            // We add a 'type' column to categorize the intervention
            $table->enum('type', [
                'academic_quiz',      // Tier 1
                'automated_nudge',    // Tier 1
                'task_list',          // Tier 2
                'extension_grant',    // Tier 2
                'parent_contact',     // Tier 2
                'counselor_referral'  // Tier 3
            ])->default('parent_contact')->after('enrollment_id');

            $table->text('notes')->nullable()->after('type'); // Add a nullable notes column
        });
    }

    public function down(): void
    {
        Schema::table('interventions', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->dropColumn('notes');
        });
    }
};
