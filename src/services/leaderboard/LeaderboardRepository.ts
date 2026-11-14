import type { LeaderboardEntry } from "@/types/game";

type LeaderboardSource = "supabase" | "local";

interface LeaderboardRepository {
    source: LeaderboardSource;
    list: () => Promise<LeaderboardEntry[]>;
    upsert: (entry: LeaderboardEntry) => Promise<void>;
}

export type { LeaderboardRepository, LeaderboardSource };
