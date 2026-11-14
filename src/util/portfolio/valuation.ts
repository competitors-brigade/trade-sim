import { GAME_RULES } from "@/data/gameRules";
import { getPrice } from "@/services/market/Market";
import { clamp } from "@/util/math/numbers";
import type { Position } from "@/types/game";

const EQUITY_FLOOR = GAME_RULES.startingCash * (1 - GAME_RULES.maxLoss);
const EQUITY_CEILING = GAME_RULES.startingCash * (1 + GAME_RULES.maxGrowth);

const computeHoldingsValue = (positions: Record<string, Position>, hour: number) =>
    Object.entries(positions).reduce((total, [symbol, position]) => total + position.shares * getPrice(symbol, hour), 0);

const computeEquity = (cash: number, positions: Record<string, Position>, hour: number) =>
    cash + computeHoldingsValue(positions, hour);

const clampEquity = (equity: number) => clamp(equity, EQUITY_FLOOR, EQUITY_CEILING);

const toReturn = (equity: number) => equity / GAME_RULES.startingCash - 1;

export { EQUITY_FLOOR, EQUITY_CEILING, computeHoldingsValue, computeEquity, clampEquity, toReturn };
