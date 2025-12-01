import { useTheme } from "@/Context/ThemeContext";
import { Sun, Moon } from "lucide-react";

/**
 * Dark Mode Toggle Button Component
 * Displays a sun/moon icon that toggles between light and dark mode
 */
export default function DarkModeToggle({ className = "" }) {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className={`relative p-2 rounded-lg transition-all duration-300 
                ${
                    darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                } ${className}`}
            aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
            <div className="relative w-5 h-5">
                {/* Sun Icon */}
                <Sun
                    size={20}
                    className={`absolute inset-0 transition-all duration-300 transform
                        ${
                            darkMode
                                ? "opacity-0 rotate-90 scale-0"
                                : "opacity-100 rotate-0 scale-100"
                        }`}
                />
                {/* Moon Icon */}
                <Moon
                    size={20}
                    className={`absolute inset-0 transition-all duration-300 transform
                        ${
                            darkMode
                                ? "opacity-100 rotate-0 scale-100"
                                : "opacity-0 -rotate-90 scale-0"
                        }`}
                />
            </div>
        </button>
    );
}

/**
 * Compact Dark Mode Toggle for navbar/header
 */
export function DarkModeToggleCompact({ className = "" }) {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                ${
                    darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                } ${className}`}
            aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
        >
            {darkMode ? (
                <>
                    <Moon size={18} className="text-yellow-400" />
                    <span className="text-sm font-medium">Dark</span>
                </>
            ) : (
                <>
                    <Sun size={18} className="text-amber-500" />
                    <span className="text-sm font-medium">Light</span>
                </>
            )}
        </button>
    );
}

/**
 * Dark Mode Toggle with system preference option
 */
export function DarkModeToggleAdvanced({ className = "" }) {
    const { darkMode, toggleDarkMode } = useTheme();

    const resetToSystem = () => {
        localStorage.removeItem("darkMode");
        const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        if (systemPrefersDark !== darkMode) {
            toggleDarkMode();
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={toggleDarkMode}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                    ${
                        darkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
            >
                {darkMode ? (
                    <Moon size={18} className="text-yellow-400" />
                ) : (
                    <Sun size={18} className="text-amber-500" />
                )}
                <span className="text-sm font-medium">
                    {darkMode ? "Dark" : "Light"}
                </span>
            </button>
            <button
                onClick={resetToSystem}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
            >
                Use system
            </button>
        </div>
    );
}
