import type { MarketModel } from "@/types/market";

const MARKET_MODEL: MarketModel = {
    marketAnnualVolatility: 0.16,
    backgroundVolatilityScale: 0.9,
    idiosyncraticFloor: 0.5,
    misreadRate: 0.12,
    immediateShare: 0.3,
    strengthExponent: 3,
    eventBlackoutHours: 24,
    impactThresholds: { low: 0.2, medium: 0.5 },
    news: {
        articlesPerWindow: 2,
        windowHours: 6,
        mix: { company: 0.7, sector: 0.2, market: 0.1 },
    },
    scopes: {
        company: {
            magnitude: { min: 0.002, max: 0.06 },
            duration: { min: 24, max: 96 },
            exposure: { base: 1, betaWeight: 0 },
        },
        sector: {
            magnitude: { min: 0.002, max: 0.02 },
            duration: { min: 48, max: 120 },
            exposure: { base: 0.7, betaWeight: 0.3 },
        },
        market: {
            magnitude: { min: 0.001, max: 0.015 },
            duration: { min: 72, max: 168 },
            exposure: { base: 0, betaWeight: 1 },
        },
    },
};

export { MARKET_MODEL };
