import type { NewsTemplate, SentimentPair } from "@/types/market";

const MARKET_NEWS: SentimentPair<NewsTemplate[]> = {
    positive: [
        {
            headline: "Central bank signals rate cuts ahead",
            summary: "Policymakers pointed to cooling inflation and a softening labor market, and investors moved to price in easier policy.",
        },
        {
            headline: "Jobs report beats forecasts while wage growth stays tame",
            summary: "Payrolls grew faster than economists expected without adding to inflation pressure.",
        },
        {
            headline: "Inflation cools more than expected",
            summary: "Consumer prices rose at the slowest pace in months, easing fears of further tightening.",
        },
        {
            headline: "Trade agreement lowers tariffs on major goods",
            summary: "Negotiators finalized a deal expected to reduce costs for importers and exporters alike.",
        },
        {
            headline: "Corporate earnings season opens with broad upside surprises",
            summary: "A large majority of early reporters topped estimates, and several raised their outlooks.",
        },
    ],
    negative: [
        {
            headline: "Inflation re-accelerates, raising fears of further rate hikes",
            summary: "Consumer prices rose faster than forecast, and investors pushed back their expectations for policy easing.",
        },
        {
            headline: "Credit spreads widen as growth worries mount",
            summary: "Borrowing costs for lower-rated companies jumped, a sign that investors are demanding more protection against a slowdown.",
        },
        {
            headline: "Geopolitical tensions rattle global markets",
            summary: "Escalating conflict raised concerns about supply routes and prompted a flight to safer assets.",
        },
        {
            headline: "Weak jobs data stokes recession concerns",
            summary: "Hiring slowed sharply and prior months were revised lower, prompting investors to reassess the outlook.",
        },
        {
            headline: "Government funding standoff raises risk of a shutdown",
            summary: "Lawmakers failed to agree on a budget, and the uncertainty is weighing on sentiment.",
        },
    ],
};

export { MARKET_NEWS };
