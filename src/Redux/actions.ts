import { createAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types/auth";
import type { Preferences, SaveData } from "@/types/store";

interface TimeAdvancedPayload {
    hour: number;
    dailyEquity: number[];
}

interface SaveLoadedPayload {
    userId: string;
    save: SaveData | null;
}

const saveLoaded = createAction<SaveLoadedPayload>("app/saveLoaded");
const preferencesLoaded = createAction<Preferences | null>("app/preferencesLoaded");
const sessionChanged = createAction<AuthUser | null>("auth/sessionChanged");
const simulationReset = createAction("app/simulationReset");
const timeAdvanced = createAction<TimeAdvancedPayload>("simulation/timeAdvanced");

export { saveLoaded, preferencesLoaded, sessionChanged, simulationReset, timeAdvanced };
export type { TimeAdvancedPayload, SaveLoadedPayload };
