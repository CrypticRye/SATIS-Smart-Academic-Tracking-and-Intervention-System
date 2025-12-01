<?php

use App\Http\Controllers\Teacher\AttendanceController;
use App\Http\Controllers\Teacher\ClassController;
use App\Http\Controllers\Teacher\GradeController;
use App\Http\Controllers\Teacher\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeacherController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
|
| This route is accessible to everyone.
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Student Portal Routes
|--------------------------------------------------------------------------
|
| These routes are only for users with the 'student' role.
|
*/

// All routes in this group are protected by the 'can:access-student-portal' gate
Route::middleware(['auth', 'verified', 'can:access-student-portal'])->group(function () {

    Route::get('/dashboard', [App\Http\Controllers\Student\DashboardController::class, 'index'])
        ->name('dashboard');

    Route::post('/notifications/{notification}/read', [App\Http\Controllers\Student\DashboardController::class, 'markNotificationRead'])
        ->name('notifications.read');

    Route::post('/notifications/read-all', [App\Http\Controllers\Student\DashboardController::class, 'markAllNotificationsRead'])
        ->name('notifications.read-all');

    Route::get('/interventions-feed', [App\Http\Controllers\Student\InterventionController::class, 'index'])
        ->name('interventions-feed');

    Route::post('/interventions/tasks/{task}/complete', [App\Http\Controllers\Student\InterventionController::class, 'completeTask'])
        ->name('interventions.tasks.complete');

    Route::post('/feedback/{notification}/read', [App\Http\Controllers\Student\InterventionController::class, 'markFeedbackRead'])
        ->name('feedback.read');

    Route::get('/subject-at-risk', [App\Http\Controllers\Student\SubjectRiskController::class, 'index'])
        ->name('subject-at-risk');

    Route::get('/learn-more', function () {
        return Inertia::render('Student/LearnMore');
    })->name('learn-more');

    Route::get('/attendance', [App\Http\Controllers\Student\AttendanceController::class, 'index'])
        ->name('attendance');

    Route::get('/analytics', [App\Http\Controllers\Student\AnalyticsController::class, 'index'])
        ->name('analytics.index');

    Route::get('/analytics/{enrollment}', [App\Http\Controllers\Student\AnalyticsController::class, 'show'])
        ->name('analytics.show');
});

/*
|--------------------------------------------------------------------------
| Teacher Portal Routes
|--------------------------------------------------------------------------
|
| These routes are only for users with the 'teacher' role.
|
*/

// All routes in this group are protected by the 'can:access-teacher-portal' gate
Route::middleware(['auth', 'verified', 'can:access-teacher-portal'])
    ->prefix('teacher') // All URLs will start with /teacher
    ->name('teacher.')  // All route names will start with teacher.
    ->group(function () {

        // Teacher Dashboard
        // URL: /teacher/dashboard
        // Name: route('teacher.dashboard')
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // --- (NEW) ATTENDANCE ROUTE ---
        // URL: /teacher/attendance
        // Name: route('teacher.attendance.index')
        Route::get('/attendance', [AttendanceController::class, 'index'])
            ->name('attendance.index');

        // --- ATTENDANCE LOG ROUTES ---
        Route::get('/attendance/log', [AttendanceController::class, 'log'])
            ->name('attendance.log');
        Route::get('/attendance/log/{subject}', [AttendanceController::class, 'show'])
            ->name('attendance.log.show');
        Route::get('/attendance/log/{subject}/export', [AttendanceController::class, 'export'])
            ->name('attendance.log.export');

        // --- (NEW) MY CLASSES ROUTE ---
        // URL: /teacher/classes
        // Name: route('teacher.classes.index')
        Route::get('/classes', [ClassController::class, 'index'])->name('classes.index');
        Route::post('/classes', [ClassController::class, 'store'])->name('classes.store');
        Route::post('/classes/{subject}/students', [ClassController::class, 'enrollStudent'])
            ->name('classes.students.store');
        Route::post('/classes/{subject}/classlist', [ClassController::class, 'uploadClasslist'])
            ->name('classes.classlist.store');
        Route::post('/classes/{subject}/grades/bulk', [GradeController::class, 'bulkStore'])
            ->name('classes.grades.bulk');
        Route::post('/classes/{subject}/grades/import', [GradeController::class, 'import'])
            ->name('classes.grades.import');
        Route::post('/classes/{subject}/grade-structure', [ClassController::class, 'updateGradeStructure'])
            ->name('classes.grade-structure.update');
        Route::post('/classes/{subject}/nudge', [ClassController::class, 'sendNudge'])
            ->name('classes.nudge');

        // --- (NEW) INTERVENTIONS ROUTE ---
        // URL: /teacher/interventions
        // Name: route('teacher.interventions.index')
        Route::get('/interventions', [App\Http\Controllers\Teacher\InterventionController::class, 'index'])
            ->name('interventions.index');

        // routes/web.php inside the 'teacher' group
        Route::post('/interventions', [App\Http\Controllers\Teacher\InterventionController::class, 'store'])
            ->name('interventions.store');

        // Bulk intervention for multiple students
        Route::post('/interventions/bulk', [App\Http\Controllers\Teacher\InterventionController::class, 'bulkStore'])
            ->name('interventions.bulk');
    });

/*
|--------------------------------------------------------------------------
| Universal Authenticated Routes
|--------------------------------------------------------------------------
|
| These routes are for *all* logged-in users (students and teachers).
|
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Post-Login Redirect Handler (NEW)
|--------------------------------------------------------------------------
|
| This is the "sorting" route that sends users to the correct dashboard
| after they log in, based on their role.
|
*/
Route::get('/redirect-after-login', function () {
    $user = Auth::user();

    if ($user->role === 'teacher') {
        return redirect()->route('teacher.dashboard');
    }

    if ($user->role === 'student') {
        return redirect()->route('dashboard');
    }

    // A fallback just in case
    return redirect('/');
})->middleware(['auth']);


/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
|
| This file (from Breeze) contains login, register, password reset, etc.
|
*/

require __DIR__ . '/auth.php';
