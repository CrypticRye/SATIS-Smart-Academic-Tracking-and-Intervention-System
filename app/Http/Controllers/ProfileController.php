<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Student;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $student = null;

        // If user is a student, get their student profile data
        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'student' => $student ? [
                'id' => $student->id,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'middle_name' => $student->middle_name,
                'lrn' => $student->lrn,
                'grade_level' => $student->grade_level,
                'section' => $student->section,
                'strand' => $student->strand,
                'track' => $student->track,
                'avatar' => $student->avatar,
            ] : null,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Validate user fields
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            // Student-specific fields (optional)
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'lrn' => ['nullable', 'string', 'max:20'],
            'grade_level' => ['nullable', 'string', 'max:50'],
            'section' => ['nullable', 'string', 'max:50'],
            'strand' => ['nullable', 'string', 'max:100'],
            'track' => ['nullable', 'string', 'max:100'],
        ]);

        // Update user
        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // Update student profile if user is a student
        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();

            if ($student) {
                $student->update([
                    'first_name' => $validated['first_name'] ?? $student->first_name,
                    'last_name' => $validated['last_name'] ?? $student->last_name,
                    'middle_name' => $validated['middle_name'] ?? $student->middle_name,
                    'lrn' => $validated['lrn'] ?? $student->lrn,
                    'grade_level' => $validated['grade_level'] ?? $student->grade_level,
                    'section' => $validated['section'] ?? $student->section,
                    'strand' => $validated['strand'] ?? $student->strand,
                    'track' => $validated['track'] ?? $student->track,
                ]);
            }
        }

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
