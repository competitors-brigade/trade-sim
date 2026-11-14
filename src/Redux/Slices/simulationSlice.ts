import { createSlice } from "@reduxjs/toolkit";
import { saveLoaded, sessionChanged, simulationReset, timeAdvanced } from "@/Redux/actions";
import type { SimulationState } from "@/types/store";

const initialState: SimulationState = {
    hour: 0,
};

const simulationSlice = createSlice({
    name: "simulation",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(timeAdvanced, (state, action) => {
                state.hour = action.payload.hour;
            })
            .addCase(saveLoaded, (_, action) => action.payload.save?.simulation ?? initialState)
            .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
            .addCase(simulationReset, () => initialState);
    },
});

export default simulationSlice.reducer;
