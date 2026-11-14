import { configureStore, type ThunkAction, type UnknownAction } from "@reduxjs/toolkit";
import simulationReducer from "./Slices/simulationSlice";
import portfolioReducer from "./Slices/portfolioSlice";
import settingsReducer from "./Slices/settingsSlice";
import leaderboardReducer from "./Slices/leaderboardSlice";
import authReducer from "./Slices/authSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        simulation: simulationReducer,
        portfolio: portfolioReducer,
        settings: settingsReducer,
        leaderboard: leaderboardReducer,
    },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
type AppThunk<Result = void> = ThunkAction<Result, RootState, unknown, UnknownAction>;

export { store };
export type { RootState, AppDispatch, AppThunk };
