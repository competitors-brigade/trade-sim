import { Link } from "react-router";
import Delta from "@/Components/Delta/Delta";
import LineChart, { type ChartPoint } from "@/Components/LineChart/LineChart";
import { SECTOR_LABELS } from "@/data/sectors";
import { formatMoney } from "@/util/format/numbers";
import { formatSimDateTime, formatSimShortDate } from "@/util/time/format";
import type { Quote, StockDefinition } from "@/types/market";
import styles from "./ChartCard.module.css";

interface ChartCardProps {
    definition: StockDefinition;
    quote: Quote;
    points: ChartPoint[];
}

const ChartCard = ({ definition, quote, points }: ChartCardProps) => (
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
        <LineChart points={points} formatY={formatMoney} formatTick={formatSimShortDate} formatTooltip={formatSimDateTime} height={170} compact emptyMessage="Advance time to see a chart." />
    </article>
);

export default ChartCard;
export type { ChartCardProps };
