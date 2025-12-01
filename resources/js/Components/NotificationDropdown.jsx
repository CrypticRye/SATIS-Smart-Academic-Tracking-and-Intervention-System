import { useState, useRef, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import {
    Bell,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    Clock,
    FileText,
    X,
    ChevronRight,
} from "lucide-react";
import NotificationBadge from "./NotificationBadge";

/**
 * Get icon and color based on notification type
 */
const getNotificationStyle = (type) => {
    const styles = {
        nudge: {
            icon: <Clock size={18} />,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
            label: "Reminder",
        },
        feedback: {
            icon: <MessageSquare size={18} />,
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
            label: "Feedback",
        },
        task: {
            icon: <FileText size={18} />,
            bgColor: "bg-purple-100",
            iconColor: "text-purple-600",
            label: "Task",
        },
        alert: {
            icon: <AlertTriangle size={18} />,
            bgColor: "bg-red-100",
            iconColor: "text-red-600",
            label: "Alert",
        },
        extension: {
            icon: <CheckCircle size={18} />,
            bgColor: "bg-yellow-100",
            iconColor: "text-yellow-600",
            label: "Extension",
        },
        intervention: {
            icon: <AlertTriangle size={18} />,
            bgColor: "bg-orange-100",
            iconColor: "text-orange-600",
            label: "Intervention",
        },
    };
    return styles[type] || styles.alert;
};

/**
 * Individual notification item in dropdown
 */
const NotificationItem = ({ notification, onClose }) => {
    const style = getNotificationStyle(notification.type);

    const handleClick = () => {
        // Mark as read
        router.post(
            route("notifications.read", { notification: notification.id }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Navigate to interventions page with highlight parameter
                    router.visit(
                        route("interventions-feed") +
                            `?highlight=${notification.id}`,
                        {
                            preserveState: false,
                        }
                    );
                    onClose();
                },
            }
        );
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-3 ${
                !notification.is_read ? "bg-blue-50/50" : ""
            }`}
        >
            {/* Icon */}
            <div
                className={`flex-shrink-0 w-9 h-9 rounded-full ${style.bgColor} ${style.iconColor} flex items-center justify-center`}
            >
                {style.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.bgColor} ${style.iconColor}`}
                    >
                        {style.label}
                    </span>
                    {!notification.is_read && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                </div>
                <p
                    className={`text-sm mt-1 line-clamp-2 ${
                        !notification.is_read
                            ? "font-semibold text-gray-900"
                            : "text-gray-700"
                    }`}
                >
                    {notification.title}
                </p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">
                        From: {notification.sender_name}
                    </p>
                    <p className="text-xs text-gray-400">
                        {notification.created_at}
                    </p>
                </div>
            </div>

            {/* Arrow */}
            <ChevronRight
                size={16}
                className="text-gray-400 flex-shrink-0 mt-2"
            />
        </button>
    );
};

/**
 * Empty state when no notifications
 */
const EmptyState = () => (
    <div className="py-8 text-center">
        <Bell size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">No notifications yet</p>
        <p className="text-gray-400 text-xs mt-1">
            You'll see updates from teachers here
        </p>
    </div>
);

/**
 * Main NotificationDropdown component
 */
export default function NotificationDropdown() {
    const { notifications } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const unreadCount = notifications?.unreadCount || 0;
    const items = notifications?.items || [];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    const handleMarkAllRead = () => {
        router.post(
            route("notifications.read-all"),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // The page will refresh with updated notification count
                },
            }
        );
    };

    const handleViewAll = () => {
        setIsOpen(false);
        router.visit(route("interventions-feed"));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300"
                aria-label={`Notifications ${
                    unreadCount > 0 ? `(${unreadCount} unread)` : ""
                }`}
            >
                <Bell size={24} />
                <NotificationBadge count={unreadCount} />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Backdrop for mobile */}
                    <div
                        className="fixed inset-0 bg-black/20 z-40 sm:hidden"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">
                                    Notifications
                                </h3>
                                {unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Notification List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {items.length > 0 ? (
                                items.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onClose={() => setIsOpen(false)}
                                    />
                                ))
                            ) : (
                                <EmptyState />
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                                <button
                                    onClick={handleViewAll}
                                    className="text-sm text-gray-600 hover:text-gray-800 font-medium ml-auto"
                                >
                                    View all →
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
