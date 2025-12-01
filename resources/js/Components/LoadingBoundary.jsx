import React from "react";
import {
    SkeletonDashboard,
    SkeletonTable,
    SkeletonCard,
    SkeletonStatCard,
    SkeletonSubjectCard,
} from "./Skeleton";

/**
 * Wrapper component that shows skeleton while content is loading
 */
export function WithSkeleton({
    loading,
    skeleton = "dashboard",
    children,
    className = "",
}) {
    if (loading) {
        const skeletons = {
            dashboard: <SkeletonDashboard />,
            table: <SkeletonTable />,
            card: <SkeletonCard />,
            cards: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ),
            stats: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonStatCard key={i} />
                    ))}
                </div>
            ),
            subjects: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonSubjectCard key={i} />
                    ))}
                </div>
            ),
        };

        return (
            <div className={className}>
                {skeletons[skeleton] || skeletons.dashboard}
            </div>
        );
    }

    return <>{children}</>;
}

/**
 * Hook for managing loading state with minimum display time
 * Prevents flash of loading state for fast operations
 */
export function useLoadingState(initialState = false, minDisplayTime = 300) {
    const [loading, setLoading] = React.useState(initialState);
    const [showSkeleton, setShowSkeleton] = React.useState(initialState);
    const startTimeRef = React.useRef(null);

    const startLoading = React.useCallback(() => {
        startTimeRef.current = Date.now();
        setLoading(true);
        setShowSkeleton(true);
    }, []);

    const stopLoading = React.useCallback(() => {
        setLoading(false);

        if (startTimeRef.current) {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, minDisplayTime - elapsed);

            setTimeout(() => {
                setShowSkeleton(false);
            }, remaining);
        } else {
            setShowSkeleton(false);
        }
    }, [minDisplayTime]);

    return {
        loading,
        showSkeleton,
        startLoading,
        stopLoading,
    };
}

/**
 * Suspense-like boundary for async data
 */
export function DataBoundary({
    data,
    fallback,
    children,
    emptyMessage = "No data available",
}) {
    // Data is still loading (undefined or null initially)
    if (data === undefined) {
        return fallback || <SkeletonCard />;
    }

    // Data is empty array
    if (Array.isArray(data) && data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                    {emptyMessage}
                </p>
            </div>
        );
    }

    // Data is loaded
    return typeof children === "function" ? children(data) : children;
}

export default WithSkeleton;
