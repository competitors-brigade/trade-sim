import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { GAME_RULES } from "@/data/gameRules";
import { saveLoaded, sessionChanged, simulationReset, timeAdvanced } from "@/Redux/actions";
import { round2 } from "@/util/math/numbers";
import type { OrderRequest } from "@/types/game";
import type { PortfolioState } from "@/types/store";

interface OrderFilledPayload extends OrderRequest {
    price: number;
    hour: number;
}

const initialState: PortfolioState = {
    cash: GAME_RULES.startingCash,
    positions: {},
    trades: [],
    equityByDay: [GAME_RULES.startingCash],
};

const portfolioSlice = createSlice({
    name: "portfolio",
    initialState,
    reducers: {
        orderFilled(state, action: PayloadAction<OrderFilledPayload>) {
            const { symbol, side, shares, price, hour } = action.payload;
            const value = round2(shares * price);
            const position = state.positions[symbol];
            let realizedPnl = 0;

            if (side === "buy") {
                const held = position?.shares ?? 0;
                const cost = (position?.avgCost ?? 0) * held + value;
                state.positions[symbol] = { shares: held + shares, avgCost: cost / (held + shares) };
                state.cash = round2(state.cash - value);
            } else if (position) {
                realizedPnl = round2((price - position.avgCost) * shares);
                position.shares -= shares;
                if (position.shares === 0) delete state.positions[symbol];
                state.cash = round2(state.cash + value);
            }

            state.trades.unshift({
                id: `trade-${state.trades.length + 1}`,
                hour,
                symbol,
                side,
                shares,
                price,
                realizedPnl,
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(timeAdvanced, (state, action) => {
                state.equityByDay.push(...action.payload.dailyEquity);
            })
            .addCase(saveLoaded, (_, action) => action.payload.save?.portfolio ?? initialState)
            .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
            .addCase(simulationReset, () => initialState);
    },
});

const { orderFilled } = portfolioSlice.actions;

export { orderFilled };
export default portfolioSlice.reducer;
export type { OrderFilledPayload };
