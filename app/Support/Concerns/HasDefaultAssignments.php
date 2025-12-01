<?php

namespace App\Support\Concerns;

use Illuminate\Support\Str;

trait HasDefaultAssignments
{
    protected function defaultGradeCategories(): array
    {
        return [
            [
                'id' => 'written_works',
                'label' => 'Written Works',
                'weight' => 0.30,
                'tasks' => [],
            ],
            [
                'id' => 'performance_task',
                'label' => 'Performance Task',
                'weight' => 0.40,
                'tasks' => [],
            ],
            [
                'id' => 'quarterly_exam',
                'label' => 'Quarterly Exam',
                'weight' => 0.30,
                'tasks' => [],
            ],
        ];
    }

    protected function defaultAssignments(): array
    {
        return $this->flattenAssignmentsFromCategories($this->defaultGradeCategories());
    }

    protected function buildGradeStructure(?array $categories = null): array
    {
        $normalized = $this->normalizeGradeCategories($categories);

        return [
            'categories' => $normalized,
            'assignments' => $this->flattenAssignmentsFromCategories($normalized),
        ];
    }

    protected function normalizeGradeCategories(?array $categories = null): array
    {
        $fallback = $categories ?? $this->defaultGradeCategories();

        return collect($fallback)
            ->map(function ($category, $index) {
                $label = trim($category['label'] ?? ('Category ' . ($index + 1)));
                $id = $category['id'] ?? Str::snake($label);
                $weight = $this->normalizeCategoryWeight($category['weight'] ?? null);

                $tasks = collect($category['tasks'] ?? [])
                    ->map(function ($task, $taskIndex) use ($id) {
                        $taskLabel = trim($task['label'] ?? ('Task ' . ($taskIndex + 1)));
                        $taskId = $task['id'] ?? Str::slug($taskLabel . '-' . $id . '-' . Str::random(6), '_');

                        return [
                            'id' => $taskId,
                            'label' => $taskLabel,
                            'total' => (float) ($task['total'] ?? 100),
                            'category_id' => $task['category_id'] ?? $id,
                        ];
                    })
                    ->values()
                    ->all();

                return [
                    'id' => $id,
                    'label' => $label,
                    'weight' => $weight,
                    'tasks' => $tasks,
                ];
            })
            ->values()
            ->all();
    }

    protected function flattenAssignmentsFromCategories(array $categories): array
    {
        return collect($categories)
            ->flatMap(function ($category) {
                return collect($category['tasks'] ?? [])->map(function ($task) use ($category) {
                    return [
                        'id' => $task['id'],
                        'label' => $task['label'],
                        'total' => $task['total'],
                        'category_id' => $task['category_id'] ?? $category['id'],
                        'category_label' => $category['label'],
                        'category_weight' => $category['weight'],
                    ];
                });
            })
            ->values()
            ->all();
    }

    private function normalizeCategoryWeight($weight): float
    {
        if ($weight === null || $weight === '') {
            return 0.0;
        }

        $numeric = is_string($weight)
            ? (float) str_replace('%', '', $weight)
            : (float) $weight;

        if ($numeric > 1) {
            $numeric = $numeric / 100;
        }

        return round($numeric, 4);
    }
}
