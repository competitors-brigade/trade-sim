import { GAME_RULES } from "@/data/gameRules";
import { MARKET_MODEL } from "@/data/marketModel";
import { STOCKS } from "@/data/stocks";
import { round2 } from "@/util/math/numbers";
import { generateEvents } from "./NewsGenerator";
import { createRng } from "./random";
import type { Market, MarketEvent, StockDefinition } from "@/types/market";

const affectsStock = (event: MarketEvent, stock: StockDefinition) => {
    if (event.scope === "company") return event.symbol === stock.symbol;
    if (event.scope === "sector") return event.sector === stock.sector;
    return true;
};

const exposureOf = (event: MarketEvent, stock: StockDefinition) => {
    const { base, betaWeight } = MARKET_MODEL.scopes[event.scope].exposure;
    return base + betaWeight * stock.beta;
};

const scheduleImpact = (drift: Float64Array, event: MarketEvent, exposure: number) => {
    const total = event.logImpact * exposure;
    const immediate = total * MARKET_MODEL.immediateShare;
    const start = event.hour + 1;
    if (start >= drift.length) return;

    drift[start] += immediate;
    const perHour = (total - immediate) / event.durationHours;
    for (let step = 0; step < event.durationHours; step++) {
        const index = start + 1 + step;
        if (index >= drift.length) break;
        drift[index] += perHour;
    }
};

const buildMarket = (seed: string, stocks: readonly StockDefinition[] = STOCKS): Market => {
    const hours = GAME_RULES.hoursPerYear;
    const events = generateEvents(seed, stocks);
    const rng = createRng(`${seed}:prices`);
    const sqrtHours = Math.sqrt(hours);

    const marketVol = MARKET_MODEL.marketAnnualVolatility;
    const marketShocks = Float64Array.from({ length: hours }, () => (rng.normal() * marketVol) / sqrtHours);

    const series: Record<string, Float64Array> = {};

    for (const stock of stocks) {
        const eventDrift = new Float64Array(hours + 1);
        for (const event of events) {
            if (event.impactful && affectsStock(event, stock)) scheduleImpact(eventDrift, event, exposureOf(event, stock));
        }

        const sigma = stock.annualVolatility;
        const background = sigma * MARKET_MODEL.backgroundVolatilityScale;
        const systematic = stock.beta * marketVol;
        const idiosyncratic = Math.sqrt(Math.max(background ** 2 - systematic ** 2, (MARKET_MODEL.idiosyncraticFloor * background) ** 2));
        const idioHourly = idiosyncratic / sqrtHours;
        const baseDrift = (stock.annualDrift - 0.5 * sigma ** 2) / hours;

        const prices = new Float64Array(hours + 1);
        let price = stock.basePrice;
        prices[0] = round2(price);
        for (let hour = 1; hour <= hours; hour++) {
            const logReturn = baseDrift + stock.beta * marketShocks[hour - 1] + rng.normal() * idioHourly + eventDrift[hour];
            price = Math.max(GAME_RULES.minPrice, price * Math.exp(logReturn));
            prices[hour] = round2(price);
        }
        series[stock.symbol] = prices;
    }

    return { series, events };
};

export { buildMarket };
