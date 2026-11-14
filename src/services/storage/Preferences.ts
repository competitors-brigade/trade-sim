import type { Preferences, ThemePreference } from "@/types/store";

const PREFERENCES_KEY = "brigade-trading.preferences";
const THEMES: readonly ThemePreference[] = ["light", "dark", "system"];

const loadPreferences = (): Preferences | null => {
    try {
        const parsed = JSON.parse(localStorage.getItem(PREFERENCES_KEY) ?? "null") as Partial<Preferences> | null;
        return parsed && parsed.theme && THEMES.includes(parsed.theme) ? { theme: parsed.theme } : null;
    } catch {
        return null;
    }
};

const writePreferences = (preferences: Preferences) => {
    try {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
        console.error("Failed to write preferences:", error);
    }
};

export { loadPreferences, writePreferences };
