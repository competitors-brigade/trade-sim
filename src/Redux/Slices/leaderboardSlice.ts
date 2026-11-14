import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GAME_RULES } from "@/data/gameRules";
import leaderboardService from "@/services/leaderboard/LeaderboardService";
import { getCompetitionPhase } from "@/util/competition/phase";
import { round2 } from "@/util/math/numbers";
import { clampEquity, computeEquity, toReturn } from "@/util/portfolio/valuation";
import type { LeaderboardEntry } from "@/types/game";
import type { LeaderboardState } from "@/types/store";
import type { RootState } from "@/Redux/store";

const initialState: LeaderboardState = {
    entries: [],
    status: "idle",
    error: null,
};

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : "Unknown error");

const fetchLeaderboard = createAsyncThunk<LeaderboardEntry[], void, { rejectValue: string }>(
    "leaderboard/fetch",
    async (_, { rejectWithValue }) => {
        try {
            return await leaderboardService.list();
        } catch (error) {
            return rejectWithValue(errorMessage(error));
        }
    },
);

const submitScore = createAsyncThunk<LeaderboardEntry[], void, { state: RootState; rejectValue: string }>(
    "leaderboard/submit",
    async (_, { getState, rejectWithValue }) => {
        const { simulation, portfolio, auth } = getState();
        if (!auth.user) return rejectWithValue("Sign in to post a score.");

        const equity = clampEquity(computeEquity(portfolio.cash, portfolio.positions, simulation.hour));
        const entry: LeaderboardEntry = {
            playerId: auth.user.id,
            name: auth.user.displayName,
            returnPct: Math.round(toReturn(equity) * 10000) / 10000,
            equity: round2(equity),
            hour: Math.min(simulation.hour, GAME_RULES.hoursPerYear),
            updatedAt: new Date().toISOString(),
        };
        try {
            await leaderboardService.upsert(entry);
            return await leaderboardService.list();
        } catch (error) {
            return rejectWithValue(errorMessage(error));
        }
    },
    {
        condition: (_, { getState }) => {
            const { auth } = getState();
            return getCompetitionPhase() === "open" && auth.user !== null && auth.loadedSaveFor === auth.user.id;
        },
    },
);

const leaderboardSlice = createSlice({
    name: "leaderboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaderboard.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchLeaderboard.fulfilled, (state, action) => {
                state.status = "ready";
                state.error = null;
                state.entries = action.payload;
            })
            .addCase(fetchLeaderboard.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload ?? "Could not load the leaderboard";
            })
            .addCase(submitScore.fulfilled, (state, action) => {
                state.status = "ready";
                state.error = null;
                state.entries = action.payload;
            })
            .addCase(submitScore.rejected, (state, action) => {
                if (action.meta.condition) return;
                state.error = action.payload ?? "Could not submit your score";
            });
    },
});

export default leaderboardSlice.reducer;
export { fetchLeaderboard, submitScore };
