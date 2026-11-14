interface ChartRange {
    value: string;
    label: string;
    hours: number;
}

type ChartType = "line" | "candles";

const CHART_RANGES: readonly ChartRange[] = [
    { value: "1d", label: "1D", hours: 24 },
    { value: "1w", label: "1W", hours: 168 },
    { value: "1m", label: "1M", hours: 720 },
    { value: "3m", label: "3M", hours: 2160 },
    { value: "all", label: "All", hours: Infinity },
];

const DEFAULT_CHART_RANGE = "1m";

const CHART_TYPES: ReadonlyArray<{ value: ChartType; label: string }> = [
    { value: "line", label: "Line" },
    { value: "candles", label: "Candles" },
];

const CANDLE_INTERVALS = [1, 4, 24, 168] as const;
const MAX_CANDLES = 100;

export { CHART_RANGES, DEFAULT_CHART_RANGE, CHART_TYPES, CANDLE_INTERVALS, MAX_CANDLES };
export type { ChartRange, ChartType };
