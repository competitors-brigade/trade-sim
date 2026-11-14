type OrderSide = "buy" | "sell";

interface Position {
    shares: number;
    avgCost: number;
}

interface Trade {
    id: string;
    hour: number;
    symbol: string;
    side: OrderSide;
    shares: number;
    price: number;
    realizedPnl: number;
}

interface OrderRequest {
    symbol: string;
    side: OrderSide;
    shares: number;
}

type OrderResult = { ok: true; trade: Trade } | { ok: false; reason: string };

interface LeaderboardEntry {
    playerId: string;
    name: string;
    returnPct: number;
    equity: number;
    hour: number;
    updatedAt: string;
}

type CompetitionPhase = "upcoming" | "open" | "closed";

interface TimePreset {
    id: string;
    label: string;
    title: string;
    resolve: (currentHour: number) => number;
}

interface PortfolioSummary {
    cash: number;
    holdingsValue: number;
    equity: number;
    scoredEquity: number;
    returnPct: number;
    capped: "growth" | "loss" | null;
    dayPnl: number;
    unrealizedPnl: number;
}

export type {
    OrderSide,
    Position,
    Trade,
    OrderRequest,
    OrderResult,
    LeaderboardEntry,
    CompetitionPhase,
    TimePreset,
    PortfolioSummary,
};
