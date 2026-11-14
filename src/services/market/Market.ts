import { MARKET_SEED } from "@/config/env";
import { GAME_RULES } from "@/data/gameRules";
import { STOCKS } from "@/data/stocks";
import { clamp } from "@/util/math/numbers";
import { HOURS_PER_DAY, DAYS_PER_WEEK } from "@/util/time/calendar";
import { buildMarket } from "./MarketEngine";
import type { Market, NewsArticle, PricePoint, Quote } from "@/types/market";

const HOURS_PER_WEEK = HOURS_PER_DAY * DAYS_PER_WEEK;

let market: Market | null = null;

const getMarket = () => {
    market ??= buildMarket(MARKET_SEED);
    return market;
};

const clampHour = (hour: number) => clamp(Math.floor(hour), 0, GAME_RULES.hoursPerYear);

const getPrice = (symbol: string, hour: number) => getMarket().series[symbol][clampHour(hour)];

const percentChange = (from: number, to: number) => (from === 0 ? 0 : to / from - 1);

const getQuote = (symbol: string, hour: number): Quote => {
    const price = getPrice(symbol, hour);
    const dayAgo = getPrice(symbol, hour - HOURS_PER_DAY);
    const weekAgo = getPrice(symbol, hour - HOURS_PER_WEEK);
    return {
        symbol,
        price,
        change24h: price - dayAgo,
        changePct24h: percentChange(dayAgo, price),
        changePct7d: percentChange(weekAgo, price),
    };
};

const getQuotes = (hour: number) => STOCKS.map((stock) => getQuote(stock.symbol, hour));

const getPriceSeries = (symbol: string, fromHour: number, toHour: number, maxPoints: number): PricePoint[] => {
    const from = clampHour(fromHour);
    const to = clampHour(toHour);
    const span = to - from;
    const step = Math.max(1, Math.ceil(span / maxPoints));
    const points: PricePoint[] = [];
    for (let hour = from; hour < to; hour += step) {
        points.push({ hour, price: getPrice(symbol, hour) });
    }
    points.push({ hour: to, price: getPrice(symbol, to) });
    return points;
};

const getNewsUpTo = (hour: number): NewsArticle[] =>
    getMarket()
        .events.filter((event) => event.hour <= hour)
        .reverse();

const getEqualWeightReturn = (hour: number) => {
    const total = STOCKS.reduce((sum, stock) => sum + getPrice(stock.symbol, hour) / getPrice(stock.symbol, 0), 0);
    return total / STOCKS.length - 1;
};

export { getPrice, getQuote, getQuotes, getPriceSeries, getNewsUpTo, getEqualWeightReturn };
