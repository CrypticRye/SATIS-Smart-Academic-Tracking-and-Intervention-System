<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('grade_level')->nullable()->after('trend');
            $table->string('section')->nullable()->after('grade_level');
            $table->string('strand')->nullable()->after('section');
            $table->string('track')->nullable()->after('strand');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['grade_level', 'section', 'strand', 'track']);
        });
    }
};
