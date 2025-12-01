<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'middle_name' => fake()->lastName(),
            'lrn' => (string) fake()->numerify('############'),
            'subject' => fake()->randomElement(['Physics', 'Mathematics', 'English', 'History', 'Science']),
            'grade' => fake()->numberBetween(60, 90),
            'trend' => fake()->randomElement(['Declining', 'Stable', 'Improving']),
            'avatar' => 'https://placehold.co/40x40/E9D5FF/4C1D95?text=SD',
            'grade_level' => fake()->randomElement(['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']),
            'section' => fake()->randomElement(['STEM-A', 'ABM-B', 'HUMSS-A', 'SPJ-A']),
            'strand' => fake()->randomElement(['STEM', 'ABM', 'HUMSS', 'SPJ']),
            'track' => fake()->randomElement(['Academic', 'TVL', 'Sports']),
        ];
    }
}
