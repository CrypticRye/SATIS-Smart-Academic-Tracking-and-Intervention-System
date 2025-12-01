/**
 * NotificationBadge Component
 *
 * A reusable red notification circle that displays unread counts.
 * Used in navigation to indicate new notifications or pending items.
 */

export default function NotificationBadge({ count = 0, className = "" }) {
    // Don't render if no notifications
    if (!count || count <= 0) {
        return null;
    }

    // Format count for display (99+ if over 99)
    const displayCount = count > 99 ? "99+" : count;

    return (
        <span
            className={`
                absolute -top-1 -right-1 
                min-w-[18px] h-[18px] 
                flex items-center justify-center 
                bg-red-500 text-white 
                text-xs font-bold 
                rounded-full 
                px-1
                animate-pulse
                ${className}
            `}
        >
            {displayCount}
        </span>
    );
}

/**
 * NotificationDot Component
 *
 * A simple red dot indicator (no count displayed).
 * Useful for subtle notification indicators on menu items.
 */
export function NotificationDot({ show = false, className = "" }) {
    if (!show) {
        return null;
    }

    return (
        <span
            className={`
                w-2 h-2 
                bg-red-500 
                rounded-full 
                animate-pulse
                ${className}
            `}
        />
    );
}
