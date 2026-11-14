import { Link } from "react-router";
import Delta from "@/Components/Delta/Delta";
import CandlestickChart from "@/Components/CandlestickChart/CandlestickChart";
import LineChart, { type ChartPoint } from "@/Components/LineChart/LineChart";
import { SECTOR_LABELS } from "@/data/sectors";
import { formatMoney } from "@/util/format/numbers";
import { formatSimDateTime, formatSimShortDate } from "@/util/time/format";
import type { ChartType } from "@/data/chartRanges";
import type { Candle, Quote, StockDefinition } from "@/types/market";
import styles from "./ChartCard.module.css";

interface ChartCardProps {
    definition: StockDefinition;
    quote: Quote;
    type: ChartType;
    points: ChartPoint[];
    candles: Candle[];
}

const ChartCard = ({ definition, quote, type, points, candles }: ChartCardProps) => (
    <article className={styles.card}>
        <Link to={`/market/${definition.symbol}`} className={styles.header}>
            <div>
                <p className={styles.symbol}>{definition.symbol}</p>
                <p className={styles.name}>
                    {definition.name} · {SECTOR_LABELS[definition.sector]}
                </p>
            </div>
            <div className={styles.price}>
                <span className="num">{formatMoney(quote.price)}</span>
                <Delta value={quote.changePct24h} kind="percent" />
            </div>
        </Link>
        {type === "line" ? (
            <LineChart points={points} formatY={formatMoney} formatTick={formatSimShortDate} formatTooltip={formatSimDateTime} height={170} compact emptyMessage="Advance time to see a chart." />
        ) : (
            <CandlestickChart candles={candles} formatY={formatMoney} formatTick={formatSimShortDate} formatTooltip={formatSimDateTime} height={170} compact emptyMessage="Advance time to see a chart." />
        )}
    </article>
);

export default ChartCard;
export type { ChartCardProps };
