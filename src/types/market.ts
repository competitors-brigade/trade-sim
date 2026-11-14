import type { SectorId } from "@/data/sectors";

type NewsScope = "company" | "sector" | "market";
type Sentiment = "positive" | "negative";

interface StockDefinition {
    symbol: string;
    name: string;
    sector: SectorId;
    basePrice: number;
    annualDrift: number;
    annualVolatility: number;
    beta: number;
}

interface NewsTemplate {
    headline: string;
    summary: string;
}

interface SentimentPair<T> {
    positive: T;
    negative: T;
}

interface NewsArticle {
    id: string;
    hour: number;
    scope: NewsScope;
    symbol?: string;
    sector?: SectorId;
    headline: string;
    summary: string;
}

interface MarketEvent extends NewsArticle {
    sentiment: Sentiment;
    impactful: boolean;
    logImpact: number;
    durationHours: number;
}

interface Quote {
    symbol: string;
    price: number;
    change24h: number;
    changePct24h: number;
    changePct7d: number;
}

interface PricePoint {
    hour: number;
    price: number;
}

interface Market {
    series: Record<string, Float64Array>;
    events: MarketEvent[];
}

interface Candle {
    hour: number;
    endHour: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface NewsRate {
    articlesPerWindow: number;
    windowHours: number;
    impactfulShare: number;
    mix: Record<NewsScope, number>;
}

interface Range {
    min: number;
    max: number;
}

interface ScopeProfile {
    magnitude: Range;
    duration: Range;
    exposure: { base: number; betaWeight: number };
}

interface MarketModel {
    marketAnnualVolatility: number;
    backgroundVolatilityScale: number;
    idiosyncraticFloor: number;
    misreadRate: number;
    immediateShare: number;
    strengthExponent: number;
    eventBlackoutHours: number;
    news: NewsRate;
    scopes: Record<NewsScope, ScopeProfile>;
}

export type {
    NewsScope,
    Sentiment,
    StockDefinition,
    NewsTemplate,
    SentimentPair,
    NewsArticle,
    MarketEvent,
    Quote,
    PricePoint,
    Candle,
    Market,
    NewsRate,
    Range,
    ScopeProfile,
    MarketModel,
};
