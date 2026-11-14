import { store } from "@/Redux/store";
import hydratePreferences from "@/Redux/Thunks/hydratePreferences";
import { restoreSession } from "@/Redux/Slices/authSlice";
import { fetchLeaderboard } from "@/Redux/Slices/leaderboardSlice";

const runStartup = async () => {
    const results = await Promise.allSettled([
        Promise.resolve().then(() => store.dispatch(hydratePreferences())),
        store.dispatch(restoreSession()),
        store.dispatch(fetchLeaderboard()),
    ]);

    for (const result of results) {
        if (result.status === "rejected") {
            console.error("Startup task failed:", result.reason);
        }
    }
};

void runStartup();
