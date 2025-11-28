<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Intervention;
use App\Models\Student; // Assuming you are linking via Student ID for now
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class InterventionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id', // Or enrollment_id
            'type' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        // logic to find the enrollment_id based on student_id if needed
        // For this example, we assume we are saving directly linked to the student or enrollment

        Intervention::create([
            'enrollment_id' => $validated['student_id'], // Adjust logic to match your Schema relations
            'type' => $validated['type'],
            'notes' => $validated['notes'],
            'status' => 'active',
        ]);

        return Redirect::back()->with('success', 'Intervention started successfully.');
    }
}
