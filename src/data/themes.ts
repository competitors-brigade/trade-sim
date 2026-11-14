import type { ThemePreference } from "@/types/store";

const THEME_OPTIONS: ReadonlyArray<{ value: ThemePreference; label: string }> = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
];

export { THEME_OPTIONS };
