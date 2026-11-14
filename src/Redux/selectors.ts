import { createSelector } from "@reduxjs/toolkit";
import { GAME_RULES } from "@/data/gameRules";
import { getNewsUpTo, getPrice, getQuotes } from "@/services/market/Market";
import { round2 } from "@/util/math/numbers";
import { HOURS_PER_DAY } from "@/util/time/calendar";
import { clampEquity, computeEquity, computeHoldingsValue, EQUITY_CEILING, EQUITY_FLOOR, toReturn } from "@/util/portfolio/valuation";
import type { PortfolioSummary } from "@/types/game";
import type { RootState } from "@/Redux/store";

const selectHour = (state: RootState) => state.simulation.hour;
const selectCash = (state: RootState) => state.portfolio.cash;
const selectPositions = (state: RootState) => state.portfolio.positions;
const selectTrades = (state: RootState) => state.portfolio.trades;
const selectEquityByDay = (state: RootState) => state.portfolio.equityByDay;

const selectNews = createSelector([selectHour], (hour) => getNewsUpTo(hour));
const selectQuotes = createSelector([selectHour], (hour) => getQuotes(hour));

const selectPortfolioSummary = createSelector(
    [selectHour, selectCash, selectPositions, selectEquityByDay],
    (hour, cash, positions, equityByDay): PortfolioSummary => {
        const holdingsValue = round2(computeHoldingsValue(positions, hour));
        const equity = round2(cash + holdingsValue);
        const scoredEquity = clampEquity(equity);
        const dayStart = equityByDay[Math.min(Math.floor(hour / HOURS_PER_DAY), equityByDay.length - 1)];
        const unrealizedPnl = Object.entries(positions).reduce(
            (total, [symbol, position]) => total + (getPrice(symbol, hour) - position.avgCost) * position.shares,
            0,
        );

        return {
            cash,
            holdingsValue,
            equity,
            scoredEquity,
            returnPct: toReturn(scoredEquity),
            capped: equity >= EQUITY_CEILING ? "growth" : equity <= EQUITY_FLOOR ? "loss" : null,
            dayPnl: scoredEquity - clampEquity(dayStart),
            unrealizedPnl,
        };
    },
);

const selectDailyPnl = createSelector(
    [selectHour, selectCash, selectPositions, selectEquityByDay],
    (hour, cash, positions, equityByDay) => {
        const totalDays = GAME_RULES.hoursPerYear / HOURS_PER_DAY;
        const completedDays = Math.floor(hour / HOURS_PER_DAY);
        const currentEquity = computeEquity(cash, positions, hour);

        return Array.from({ length: totalDays }, (_, day): number | null => {
            if (day > completedDays || day >= equityByDay.length) return null;
            const start = clampEquity(equityByDay[day]);
            if (day < completedDays) return clampEquity(equityByDay[day + 1]) - start;
            if (hour >= GAME_RULES.hoursPerYear) return null;
            return clampEquity(currentEquity) - start;
        });
    },
);

export {
    selectHour,
    selectCash,
    selectPositions,
    selectTrades,
    selectEquityByDay,
    selectNews,
    selectQuotes,
    selectPortfolioSummary,
    selectDailyPnl,
};
