import { useMemo, useRef, useState, type PointerEvent } from "react";
import useElementWidth from "@/Hooks/useElementWidth";
import { niceTicks } from "@/util/math/numbers";
import { cx } from "@/util/ui/classNames";
import styles from "./LineChart.module.css";

interface ChartPoint {
    x: number;
    y: number;
}

interface LineChartProps {
    points: ChartPoint[];
    formatY: (value: number) => string;
    formatTick: (x: number) => string;
    formatTooltip: (x: number) => string;
    baseline?: number;
    height?: number;
    compact?: boolean;
    emptyMessage?: string;
}

const REGULAR = { margin: { top: 12, right: 16, bottom: 26, left: 68 }, yTicks: 4, xTicks: 4 };
const COMPACT = { margin: { top: 8, right: 8, bottom: 20, left: 54 }, yTicks: 2, xTicks: 2 };

const nearestIndex = (points: ChartPoint[], x: number) => {
    let low = 0;
    let high = points.length - 1;
    while (high - low > 1) {
        const mid = (low + high) >> 1;
        if (points[mid].x < x) low = mid;
        else high = mid;
    }
    return Math.abs(points[low].x - x) <= Math.abs(points[high].x - x) ? low : high;
};

const LineChart = ({ points, formatY, formatTick, formatTooltip, baseline, height = 260, compact = false, emptyMessage }: LineChartProps) => {
    const { margin, yTicks: yTickCount, xTicks: xTickCount } = compact ? COMPACT : REGULAR;
    const containerRef = useRef<HTMLDivElement>(null);
    const width = useElementWidth(containerRef);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const chart = useMemo(() => {
        if (points.length < 2 || width === 0) return null;

        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const xMin = points[0].x;
        const xMax = points[points.length - 1].x;

        let yMin = Math.min(...points.map((point) => point.y), baseline ?? Infinity);
        let yMax = Math.max(...points.map((point) => point.y), baseline ?? -Infinity);
        const padding = (yMax - yMin || Math.abs(yMax) * 0.02 || 1) * 0.1;
        yMin -= padding;
        yMax += padding;

        const scaleX = (x: number) => margin.left + ((x - xMin) / (xMax - xMin || 1)) * innerWidth;
        const scaleY = (y: number) => margin.top + (1 - (y - yMin) / (yMax - yMin)) * innerHeight;

        const line = points.map((point, index) => `${index ? "L" : "M"}${scaleX(point.x).toFixed(1)} ${scaleY(point.y).toFixed(1)}`).join(" ");
        const bottom = margin.top + innerHeight;
        const area = `${line} L${scaleX(xMax).toFixed(1)} ${bottom} L${scaleX(xMin).toFixed(1)} ${bottom} Z`;
        const reference = baseline ?? points[0].y;

        return {
            innerWidth,
            xMin,
            xMax,
            scaleX,
            scaleY,
            line,
            area,
            bottom,
            positive: points[points.length - 1].y >= reference,
            yTicks: niceTicks(yMin, yMax, yTickCount),
            xTicks: Array.from({ length: xTickCount + 1 }, (_, i) => xMin + ((xMax - xMin) * i) / xTickCount),
        };
    }, [points, baseline, width, height, margin, yTickCount, xTickCount]);

    const handlePointerMove = (event: PointerEvent<SVGRectElement>) => {
        if (!chart) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const ratio = (event.clientX - bounds.left) / bounds.width;
        setHoverIndex(nearestIndex(points, chart.xMin + ratio * (chart.xMax - chart.xMin)));
    };

    const hovered = chart && hoverIndex !== null ? points[hoverIndex] : null;
    const tooltipLeft = chart && hovered ? chart.scaleX(hovered.x) : 0;

    return (
        <div ref={containerRef} className={styles.container} style={{ height }}>
            {!chart ? (
                <p className={styles.empty}>{emptyMessage ?? "Not enough data to draw a chart yet."}</p>
            ) : (
                <>
                    <svg width={width} height={height} className={cx(styles.svg, chart.positive ? styles.positive : styles.negative)}>
                        {chart.yTicks.map((tick) => (
                            <g key={tick}>
                                <line className={styles.grid} x1={margin.left} x2={width - margin.right} y1={chart.scaleY(tick)} y2={chart.scaleY(tick)} />
                                <text className={styles.tickLabel} x={margin.left - 10} y={chart.scaleY(tick)} textAnchor="end" dominantBaseline="middle">
                                    {formatY(tick)}
                                </text>
                            </g>
                        ))}
                        {chart.xTicks.map((tick, index) => (
                            <text
                                key={tick}
                                className={styles.tickLabel}
                                x={chart.scaleX(tick)}
                                y={chart.bottom + 17}
                                textAnchor={index === 0 ? "start" : index === xTickCount ? "end" : "middle"}
                            >
                                {formatTick(tick)}
                            </text>
                        ))}
                        {baseline !== undefined && (
                            <line className={styles.baseline} x1={margin.left} x2={width - margin.right} y1={chart.scaleY(baseline)} y2={chart.scaleY(baseline)} />
                        )}
                        <path className={styles.area} d={chart.area} />
                        <path className={styles.line} d={chart.line} />
                        {hovered && (
                            <g>
                                <line className={styles.cursor} x1={tooltipLeft} x2={tooltipLeft} y1={margin.top} y2={chart.bottom} />
                                <circle className={styles.dot} cx={tooltipLeft} cy={chart.scaleY(hovered.y)} r={3.5} />
                            </g>
                        )}
                        <rect
                            x={margin.left}
                            y={margin.top}
                            width={chart.innerWidth}
                            height={chart.bottom - margin.top}
                            fill="transparent"
                            onPointerMove={handlePointerMove}
                            onPointerLeave={() => setHoverIndex(null)}
                        />
                    </svg>
                    {hovered && (
                        <div className={styles.tooltip} style={{ left: tooltipLeft, transform: `translateX(${tooltipLeft > width * 0.7 ? "-105%" : "10px"})` }}>
                            <span className={styles.tooltipLabel}>{formatTooltip(hovered.x)}</span>
                            <span className="num">{formatY(hovered.y)}</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LineChart;
export type { ChartPoint, LineChartProps };
