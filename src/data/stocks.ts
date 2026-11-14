import type { StockDefinition } from "@/types/market";

const STOCKS: readonly StockDefinition[] = [
    { symbol: "NVLT", name: "Novalite Semiconductor", sector: "technology", basePrice: 142.3, annualDrift: 0.1, annualVolatility: 0.48, beta: 1.35 },
    { symbol: "CLDR", name: "Cloudrift Software", sector: "technology", basePrice: 88.45, annualDrift: 0.09, annualVolatility: 0.38, beta: 1.15 },
    { symbol: "QBTX", name: "Quantabyte Computing", sector: "technology", basePrice: 23.8, annualDrift: 0.12, annualVolatility: 0.65, beta: 1.5 },
    { symbol: "SNTL", name: "Sentinel Cyber", sector: "technology", basePrice: 67.2, annualDrift: 0.08, annualVolatility: 0.36, beta: 1.05 },
    { symbol: "BRNT", name: "Brantley Petroleum", sector: "energy", basePrice: 54.1, annualDrift: 0.05, annualVolatility: 0.3, beta: 0.9 },
    { symbol: "SLRG", name: "Solargrid Power", sector: "energy", basePrice: 31.65, annualDrift: 0.1, annualVolatility: 0.55, beta: 1.3 },
    { symbol: "ATLS", name: "Atlas Midstream", sector: "energy", basePrice: 41.9, annualDrift: 0.06, annualVolatility: 0.22, beta: 0.6 },
    { symbol: "HLXB", name: "Helix Biosciences", sector: "healthcare", basePrice: 76.8, annualDrift: 0.1, annualVolatility: 0.5, beta: 1.0 },
    { symbol: "MRDN", name: "Meridian Health", sector: "healthcare", basePrice: 112.4, annualDrift: 0.07, annualVolatility: 0.24, beta: 0.7 },
    { symbol: "PLSR", name: "Pulsera Diagnostics", sector: "healthcare", basePrice: 48.25, annualDrift: 0.08, annualVolatility: 0.34, beta: 0.85 },
    { symbol: "CRWN", name: "Crown Harbor Bank", sector: "financials", basePrice: 63.9, annualDrift: 0.06, annualVolatility: 0.28, beta: 1.1 },
    { symbol: "LDGR", name: "Ledgerline Capital", sector: "financials", basePrice: 129.55, annualDrift: 0.07, annualVolatility: 0.31, beta: 1.2 },
    { symbol: "PNCL", name: "Pinnacle Insurance Group", sector: "financials", basePrice: 95.15, annualDrift: 0.05, annualVolatility: 0.2, beta: 0.65 },
    { symbol: "ARBR", name: "Arbor & Pine Retail", sector: "consumer", basePrice: 37.4, annualDrift: 0.06, annualVolatility: 0.36, beta: 1.1 },
    { symbol: "FRSH", name: "Freshfield Foods", sector: "consumer", basePrice: 58.7, annualDrift: 0.04, annualVolatility: 0.18, beta: 0.45 },
    { symbol: "VELO", name: "Velocity Motors", sector: "consumer", basePrice: 184.2, annualDrift: 0.11, annualVolatility: 0.58, beta: 1.4 },
    { symbol: "STRM", name: "Streamline Entertainment", sector: "consumer", basePrice: 72.35, annualDrift: 0.07, annualVolatility: 0.4, beta: 1.05 },
    { symbol: "FRGE", name: "Forgeworks Industrial", sector: "industrials", basePrice: 102.8, annualDrift: 0.06, annualVolatility: 0.26, beta: 1.0 },
    { symbol: "AEGS", name: "Aegis Aerospace", sector: "industrials", basePrice: 156.4, annualDrift: 0.07, annualVolatility: 0.29, beta: 0.9 },
    { symbol: "TRNS", name: "Transcontinental Freight", sector: "industrials", basePrice: 46.55, annualDrift: 0.05, annualVolatility: 0.27, beta: 1.0 },
];

const STOCKS_BY_SYMBOL: Record<string, StockDefinition> = Object.fromEntries(STOCKS.map((stock) => [stock.symbol, stock]));

export { STOCKS, STOCKS_BY_SYMBOL };
