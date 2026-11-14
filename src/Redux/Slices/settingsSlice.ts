import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { preferencesLoaded } from "@/Redux/actions";
import type { SettingsState, ThemePreference } from "@/types/store";

const initialState: SettingsState = {
    theme: "system",
    hydrated: false,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        themeChanged(state, action: PayloadAction<ThemePreference>) {
            state.theme = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(preferencesLoaded, (state, action) => {
            if (action.payload) state.theme = action.payload.theme;
            state.hydrated = true;
        });
    },
});

const { themeChanged } = settingsSlice.actions;

export { themeChanged };
export default settingsSlice.reducer;
