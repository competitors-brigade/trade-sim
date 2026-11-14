import type { SaveData } from "@/types/store";

const SAVE_KEY_PREFIX = "brigade-trading.save";
const SAVE_VERSION = 2;

const keyFor = (userId: string) => `${SAVE_KEY_PREFIX}.${userId}`;

const isSaveData = (value: unknown): value is SaveData => {
    if (typeof value !== "object" || value === null) return false;
    const save = value as Partial<SaveData>;
    return (
        save.version === SAVE_VERSION &&
        typeof save.simulation?.hour === "number" &&
        typeof save.portfolio?.cash === "number" &&
        Array.isArray(save.portfolio.equityByDay) &&
        Array.isArray(save.portfolio.trades)
    );
};

const loadSave = (userId: string): SaveData | null => {
    try {
        const raw = localStorage.getItem(keyFor(userId));
        if (!raw) return null;
        const parsed: unknown = JSON.parse(raw);
        return isSaveData(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

const writeSave = (userId: string, save: SaveData) => {
    try {
        localStorage.setItem(keyFor(userId), JSON.stringify(save));
    } catch (error) {
        console.error("Failed to write save:", error);
    }
};

export { SAVE_VERSION, loadSave, writeSave };
