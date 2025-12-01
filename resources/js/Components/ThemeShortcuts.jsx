import { useEffect } from "react";
import useKeyboardShortcuts, {
    KeyboardShortcutPresets,
} from "@/Hooks/useKeyboardShortcuts";
import { useTheme } from "@/Context/ThemeContext";
import showToast from "@/Utils/toast";

export default function ThemeShortcuts() {
    const { toggleDarkMode } = useTheme();

    useKeyboardShortcuts(
        {
            "ctrl+d": {
                action: () => {
                    toggleDarkMode();
                    showToast.info("Toggled theme");
                },
                description: "Toggle dark mode",
            },
            "meta+d": {
                action: () => {
                    toggleDarkMode();
                    showToast.info("Toggled theme");
                },
                description: "Toggle dark mode (mac)",
            },
        },
        { enabled: true, preventDefault: true }
    );

    return null;
}
