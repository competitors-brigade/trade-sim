import type { SupabaseClient } from "@supabase/supabase-js";
import { GAME_RULES } from "@/data/gameRules";
import type { LeaderboardEntry } from "@/types/game";
import type { LeaderboardRepository } from "./LeaderboardRepository";

const TABLE = "leaderboard";

interface LeaderboardRow {
    player_id: string;
    name: string;
    return_pct: number;
    equity: number;
    hour: number;
    updated_at: string;
}

const fromRow = (row: LeaderboardRow): LeaderboardEntry => ({
    playerId: row.player_id,
    name: row.name,
    returnPct: row.return_pct,
    equity: row.equity,
    hour: row.hour,
    updatedAt: row.updated_at,
});

const toRow = (entry: LeaderboardEntry): LeaderboardRow => ({
    player_id: entry.playerId,
    name: entry.name,
    return_pct: entry.returnPct,
    equity: entry.equity,
    hour: entry.hour,
    updated_at: entry.updatedAt,
});

const createSupabaseLeaderboard = (client: SupabaseClient): LeaderboardRepository => ({
    source: "supabase",

    list: async () => {
        const { data, error } = await client
            .from(TABLE)
            .select("*")
            .order("return_pct", { ascending: false })
            .limit(GAME_RULES.leaderboardSize);
        if (error) throw new Error(error.message);
        return ((data ?? []) as LeaderboardRow[]).map(fromRow);
    },

    upsert: async (entry) => {
        const { error } = await client.from(TABLE).upsert(toRow(entry), { onConflict: "player_id" });
        if (error) throw new Error(error.message);
    },
});

export default createSupabaseLeaderboard;
