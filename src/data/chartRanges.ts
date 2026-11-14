interface ChartRange {
    value: string;
    label: string;
    hours: number;
}

const CHART_RANGES: readonly ChartRange[] = [
    { value: "1w", label: "1W", hours: 168 },
    { value: "1m", label: "1M", hours: 720 },
    { value: "3m", label: "3M", hours: 2160 },
    { value: "all", label: "All", hours: Infinity },
];

const DEFAULT_CHART_RANGE = "1m";

export { CHART_RANGES, DEFAULT_CHART_RANGE };
export type { ChartRange };
