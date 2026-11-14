import type { LeaderboardEntry } from "@/types/game";
import type { LeaderboardRepository } from "./LeaderboardRepository";

const STORAGE_KEY = "brigade-trading.leaderboard";

const read = (): LeaderboardEntry[] => {
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        return Array.isArray(parsed) ? (parsed as LeaderboardEntry[]) : [];
    } catch {
        return [];
    }
};

const write = (entries: LeaderboardEntry[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
        console.error("Failed to write local leaderboard:", error);
    }
};

const createLocalLeaderboard = (): LeaderboardRepository => ({
    source: "local",

    list: async () => read().sort((a, b) => b.returnPct - a.returnPct),

    upsert: async (entry) => {
        write([...read().filter((existing) => existing.playerId !== entry.playerId), entry]);
    },
});

export default createLocalLeaderboard;
