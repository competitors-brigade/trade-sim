import type { SectorId } from "@/data/sectors";

type NewsScope = "company" | "sector" | "market";
type Sentiment = "positive" | "negative";
type ImpactLevel = "low" | "medium" | "high";

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
    sentiment: Sentiment;
    impact: ImpactLevel;
    headline: string;
    summary: string;
}

interface MarketEvent extends NewsArticle {
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

interface NewsRate {
    articlesPerWindow: number;
    windowHours: number;
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
    impactThresholds: { low: number; medium: number };
    news: NewsRate;
    scopes: Record<NewsScope, ScopeProfile>;
}

export type {
    NewsScope,
    Sentiment,
    ImpactLevel,
    StockDefinition,
    NewsTemplate,
    SentimentPair,
    NewsArticle,
    MarketEvent,
    Quote,
    PricePoint,
    Market,
    NewsRate,
    Range,
    ScopeProfile,
    MarketModel,
};
