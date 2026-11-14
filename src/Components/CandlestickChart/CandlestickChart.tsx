import { useMemo, useRef, useState, type PointerEvent } from "react";
import useElementWidth from "@/Hooks/useElementWidth";
import { niceTicks } from "@/util/math/numbers";
import { cx } from "@/util/ui/classNames";
import type { Candle } from "@/types/market";
import styles from "./CandlestickChart.module.css";

interface CandlestickChartProps {
    candles: Candle[];
    formatY: (value: number) => string;
    formatTick: (hour: number) => string;
    formatTooltip: (hour: number) => string;
    height?: number;
    compact?: boolean;
    emptyMessage?: string;
}

const REGULAR = { margin: { top: 12, right: 16, bottom: 26, left: 68 }, yTicks: 4, xTicks: 4 };
const COMPACT = { margin: { top: 8, right: 8, bottom: 20, left: 54 }, yTicks: 2, xTicks: 2 };
const MAX_BODY_WIDTH = 14;
const BODY_SHARE = 0.7;

const CandlestickChart = ({ candles, formatY, formatTick, formatTooltip, height = 260, compact = false, emptyMessage }: CandlestickChartProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const width = useElementWidth(containerRef);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const { margin, yTicks: yTickCount, xTicks: xTickCount } = compact ? COMPACT : REGULAR;

    const chart = useMemo(() => {
        if (candles.length === 0 || width === 0) return null;

        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const slot = innerWidth / candles.length;
        const bodyWidth = Math.max(1, Math.min(slot * BODY_SHARE, MAX_BODY_WIDTH));

        let yMin = Math.min(...candles.map((candle) => candle.low));
        let yMax = Math.max(...candles.map((candle) => candle.high));
        const padding = (yMax - yMin || yMax * 0.02 || 1) * 0.08;
        yMin -= padding;
        yMax += padding;

        const scaleY = (y: number) => margin.top + (1 - (y - yMin) / (yMax - yMin)) * innerHeight;
        const centerX = (index: number) => margin.left + (index + 0.5) * slot;
        const tickCount = Math.min(xTickCount, candles.length - 1);
        const xTickIndexes = Array.from(new Set(Array.from({ length: tickCount + 1 }, (_, i) => (tickCount === 0 ? 0 : Math.round(((candles.length - 1) * i) / tickCount)))));

        return {
            innerWidth,
            innerHeight,
            slot,
            bodyWidth,
            scaleY,
            centerX,
            bottom: margin.top + innerHeight,
            yTicks: niceTicks(yMin, yMax, yTickCount),
            xTickIndexes,
        };
    }, [candles, width, height, margin, yTickCount, xTickCount]);

    const handlePointerMove = (event: PointerEvent<SVGRectElement>) => {
        if (!chart) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const index = Math.floor(((event.clientX - bounds.left) / bounds.width) * candles.length);
        setHoverIndex(Math.min(candles.length - 1, Math.max(0, index)));
    };

    const hovered = chart && hoverIndex !== null ? candles[hoverIndex] : null;
    const tooltipLeft = chart && hoverIndex !== null ? chart.centerX(hoverIndex) : 0;

    return (
        <div ref={containerRef} className={styles.container} style={{ height }}>
            {!chart ? (
                <p className={styles.empty}>{emptyMessage ?? "Not enough data to draw a chart yet."}</p>
            ) : (
                <>
                    <svg width={width} height={height} className={styles.svg}>
                        {chart.yTicks.map((tick) => (
                            <g key={tick}>
                                <line className={styles.grid} x1={margin.left} x2={width - margin.right} y1={chart.scaleY(tick)} y2={chart.scaleY(tick)} />
                                <text className={styles.tickLabel} x={margin.left - 10} y={chart.scaleY(tick)} textAnchor="end" dominantBaseline="middle">
                                    {formatY(tick)}
                                </text>
                            </g>
                        ))}
                        {chart.xTickIndexes.map((index, position) => (
                            <text
                                key={index}
                                className={styles.tickLabel}
                                x={chart.centerX(index)}
                                y={chart.bottom + 17}
                                textAnchor={position === 0 && chart.xTickIndexes.length > 1 ? "start" : position === chart.xTickIndexes.length - 1 && position > 0 ? "end" : "middle"}
                            >
                                {formatTick(candles[index].hour)}
                            </text>
                        ))}
                        {candles.map((candle, index) => {
                            const rising = candle.close >= candle.open;
                            const x = chart.centerX(index);
                            const bodyTop = chart.scaleY(Math.max(candle.open, candle.close));
                            const bodyHeight = Math.max(1, Math.abs(chart.scaleY(candle.open) - chart.scaleY(candle.close)));

                            return (
                                <g key={candle.hour} className={cx(rising ? styles.rising : styles.falling, index === hoverIndex && styles.active)}>
                                    <line className={styles.wick} x1={x} x2={x} y1={chart.scaleY(candle.high)} y2={chart.scaleY(candle.low)} />
                                    <rect className={styles.body} x={x - chart.bodyWidth / 2} y={bodyTop} width={chart.bodyWidth} height={bodyHeight} />
                                </g>
                            );
                        })}
                        <rect
                            x={margin.left}
                            y={margin.top}
                            width={chart.innerWidth}
                            height={chart.innerHeight}
                            fill="transparent"
                            onPointerMove={handlePointerMove}
                            onPointerLeave={() => setHoverIndex(null)}
                        />
                    </svg>
                    {hovered && (
                        <div className={styles.tooltip} style={{ left: tooltipLeft, transform: `translateX(${tooltipLeft > width * 0.65 ? "-105%" : "10px"})` }}>
                            <span className={styles.tooltipLabel}>{formatTooltip(hovered.hour)}</span>
                            <dl className={styles.values}>
                                <dt>O</dt>
                                <dd className="num">{formatY(hovered.open)}</dd>
                                <dt>H</dt>
                                <dd className="num">{formatY(hovered.high)}</dd>
                                <dt>L</dt>
                                <dd className="num">{formatY(hovered.low)}</dd>
                                <dt>C</dt>
                                <dd className="num">{formatY(hovered.close)}</dd>
                            </dl>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CandlestickChart;
export type { CandlestickChartProps };
