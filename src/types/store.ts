import type { LeaderboardEntry, Position, Trade } from "./game";

type ThemePreference = "light" | "dark" | "system";
type LoadStatus = "idle" | "loading" | "ready" | "error";

interface SimulationState {
    hour: number;
}

interface PortfolioState {
    cash: number;
    positions: Record<string, Position>;
    trades: Trade[];
    equityByDay: number[];
}

interface Preferences {
    theme: ThemePreference;
}

interface SettingsState extends Preferences {
    hydrated: boolean;
}

interface LeaderboardState {
    entries: LeaderboardEntry[];
    status: LoadStatus;
    error: string | null;
}

interface SaveData {
    version: number;
    simulation: SimulationState;
    portfolio: PortfolioState;
}

export type {
    ThemePreference,
    LoadStatus,
    SimulationState,
    PortfolioState,
    Preferences,
    SettingsState,
    LeaderboardState,
    SaveData,
};
