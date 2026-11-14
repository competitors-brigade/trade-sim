import type { SentimentPair } from "@/types/market";

const SECTOR_FRAMES: SentimentPair<string[]> = {
    positive: ["{Sector} stocks rally as {driver}", "{Sector} shares climb after {driver}", "{Driver}, a boost for {sector} names"],
    negative: ["{Sector} stocks slide as {driver}", "{Sector} shares fall after {driver}", "{Driver}, a drag on {sector} names"],
};

const SECTOR_SUMMARIES: SentimentPair<string[]> = {
    positive: [
        "Analysts say the move reflects improving fundamentals across the {sector} group.",
        "Strategists expect the momentum to support {sector} earnings estimates in the coming quarters.",
        "Desk commentary points to fund managers adding to {sector} positions.",
        "The development is seen as a meaningful tailwind for {sector} companies.",
    ],
    negative: [
        "Analysts say the development raises fresh questions about {sector} earnings.",
        "Strategists warn the pressure could persist across {sector} companies in the coming quarters.",
        "Desk commentary points to investors trimming {sector} exposure.",
        "The development is seen as a meaningful headwind for {sector} companies.",
    ],
};

const MARKET_FRAMES: SentimentPair<string[]> = {
    positive: ["Stocks rise as {driver}", "Markets rally after {driver}", "{Driver}, a boost for broad indices"],
    negative: ["Stocks fall as {driver}", "Markets slide after {driver}", "{Driver}, a drag on broad indices"],
};

const MARKET_SUMMARIES: SentimentPair<string[]> = {
    positive: [
        "Broad indices moved higher as investors reassessed the outlook for growth and policy.",
        "Traders said the news improved risk appetite across most sectors.",
        "Strategists noted that the development supports expectations for corporate earnings.",
        "Investors rotated into equities after the news, with gains spread across industries.",
    ],
    negative: [
        "Broad indices moved lower as investors reassessed the outlook for growth and policy.",
        "Traders said the news dampened risk appetite across most sectors.",
        "Strategists noted that the development clouds expectations for corporate earnings.",
        "Investors reduced equity exposure after the news, with losses spread across industries.",
    ],
};

const MARKET_DRIVERS: SentimentPair<string[]> = {
    positive: [
        "inflation comes in cooler than expected",
        "the central bank signals rate cuts",
        "payrolls beat forecasts without wage pressure",
        "a trade deal lowers tariffs",
        "earnings season opens with upside surprises",
        "consumer spending stays resilient",
        "bond yields retreat from recent highs",
        "manufacturing data beats forecasts",
        "geopolitical tensions ease",
        "a budget agreement avoids a shutdown",
    ],
    negative: [
        "inflation re-accelerates",
        "the central bank signals more rate hikes",
        "hiring slows sharply",
        "credit spreads widen",
        "geopolitical tensions escalate",
        "bond yields jump",
        "earnings guidance disappoints",
        "a funding standoff raises shutdown risk",
        "consumer sentiment drops",
        "trade tariffs are expanded",
    ],
};

const NEWS_SLOTS = {
    amounts: ["$85 million", "$120 million", "$240 million", "$410 million", "$650 million", "$1.2 billion"],
    percent: { min: 3, max: 24 },
};

export { SECTOR_FRAMES, SECTOR_SUMMARIES, MARKET_FRAMES, MARKET_SUMMARIES, MARKET_DRIVERS, NEWS_SLOTS };
