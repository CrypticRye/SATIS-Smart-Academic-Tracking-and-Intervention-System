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
        Schema::create('student_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The student receiving the notification
            $table->foreignId('intervention_id')->nullable()->constrained()->onDelete('cascade'); // Link to intervention if applicable
            $table->foreignId('sender_id')->nullable()->constrained('users')->onDelete('set null'); // The teacher who sent it
            $table->string('type'); // 'nudge', 'feedback', 'task', 'alert', etc.
            $table->string('title');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_notifications');
    }
};
