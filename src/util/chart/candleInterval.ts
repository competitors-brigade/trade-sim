import { CANDLE_INTERVALS, MAX_CANDLES } from "@/data/chartRanges";

const pickCandleInterval = (spanHours: number) =>
    CANDLE_INTERVALS.find((interval) => spanHours / interval <= MAX_CANDLES) ?? CANDLE_INTERVALS[CANDLE_INTERVALS.length - 1];

export { pickCandleInterval };
