import React from "react";

/**
 * Base Skeleton component with shimmer animation
 */
export function Skeleton({ className = "", ...props }) {
    return (
        <div
            className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
            {...props}
        />
    );
}

/**
 * Text skeleton for loading text content
 */
export function SkeletonText({ lines = 3, className = "" }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
                />
            ))}
        </div>
    );
}

/**
 * Avatar/Circle skeleton
 */
export function SkeletonAvatar({ size = "md", className = "" }) {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24",
    };

    return <Skeleton className={`rounded-full ${sizes[size]} ${className}`} />;
}

/**
 * Card skeleton for loading card content
 */
export function SkeletonCard({ className = "" }) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}
        >
            <div className="flex items-center gap-4 mb-4">
                <SkeletonAvatar size="md" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                </div>
            </div>
            <SkeletonText lines={2} />
            <div className="mt-4 flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
        </div>
    );
}

/**
 * Stat card skeleton
 */
export function SkeletonStatCard({ className = "" }) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}
        >
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="w-12 h-12 rounded-xl" />
            </div>
            <Skeleton className="h-3 w-16 mt-2" />
        </div>
    );
}

/**
 * Table row skeleton
 */
export function SkeletonTableRow({ columns = 5 }) {
    return (
        <tr className="border-b border-gray-200 dark:border-gray-700">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-4">
                    <Skeleton className={`h-4 ${i === 0 ? "w-32" : "w-20"}`} />
                </td>
            ))}
        </tr>
    );
}

/**
 * Full table skeleton
 */
export function SkeletonTable({ rows = 5, columns = 5, className = "" }) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}
        >
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {Array.from({ length: columns }).map((_, i) => (
                                <th key={i} className="px-4 py-3">
                                    <Skeleton className="h-4 w-20" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, i) => (
                            <SkeletonTableRow key={i} columns={columns} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/**
 * Student card skeleton (for intervention pages)
 */
export function SkeletonStudentCard({ className = "" }) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}
        >
            <div className="flex items-center gap-3">
                <SkeletonAvatar size="md" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="mt-3 flex gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    );
}

/**
 * Dashboard skeleton layout
 */
export function SkeletonDashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-48" />
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonStatCard key={i} />
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
                <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        </div>
    );
}

/**
 * Subject card skeleton (for analytics pages)
 */
export function SkeletonSubjectCard({ className = "" }) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                    <Skeleton className="h-3 w-12 mx-auto mb-1" />
                    <Skeleton className="h-6 w-8 mx-auto" />
                </div>
                <div className="text-center">
                    <Skeleton className="h-3 w-12 mx-auto mb-1" />
                    <Skeleton className="h-6 w-8 mx-auto" />
                </div>
                <div className="text-center">
                    <Skeleton className="h-3 w-12 mx-auto mb-1" />
                    <Skeleton className="h-6 w-8 mx-auto" />
                </div>
            </div>
        </div>
    );
}

/**
 * Notification item skeleton
 */
export function SkeletonNotification({ className = "" }) {
    return (
        <div className={`flex items-start gap-3 p-3 ${className}`}>
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}

/**
 * List skeleton with avatar items
 */
export function SkeletonList({ items = 5, className = "" }) {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: items }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                    <SkeletonAvatar size="sm" />
                    <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-8 w-16 rounded" />
                </div>
            ))}
        </div>
    );
}

export default Skeleton;
