import { useMemo, useState } from "react";
import { Link } from "react-router";
import Delta from "@/Components/Delta/Delta";
import PageHeader from "@/Components/PageHeader/PageHeader";
import Panel from "@/Components/Panel/Panel";
import Sparkline from "@/Components/Sparkline/Sparkline";
import { SECTOR_LABELS } from "@/data/sectors";
import { useStockList } from "@/Hooks/useMarket";
import { usePositions } from "@/Hooks/usePortfolio";
import useSimClock from "@/Hooks/useSimClock";
import { getPriceSeries } from "@/services/market/Market";
import { formatInteger, formatMoney } from "@/util/format/numbers";
import { DAYS_PER_WEEK, HOURS_PER_DAY } from "@/util/time/calendar";
import styles from "./Market.module.css";

type SortKey = "symbol" | "price" | "day" | "week";
type SortDirection = "asc" | "desc";

interface Column {
    key: SortKey;
    label: string;
    align?: "right";
}

const SPARKLINE_POINTS = 28;

const COLUMNS: readonly Column[] = [
    { key: "symbol", label: "Company" },
    { key: "price", label: "Price", align: "right" },
    { key: "day", label: "24h", align: "right" },
    { key: "week", label: "7d", align: "right" },
];

const Market = () => {
    const stocks = useStockList();
    const positions = usePositions();
    const { hour } = useSimClock();
    const [sortKey, setSortKey] = useState<SortKey>("symbol");
    const [direction, setDirection] = useState<SortDirection>("asc");

    const rows = useMemo(() => {
        const values: Record<SortKey, (row: (typeof stocks)[number]) => number | string> = {
            symbol: (row) => row.definition.symbol,
            price: (row) => row.quote.price,
            day: (row) => row.quote.changePct24h,
            week: (row) => row.quote.changePct7d,
        };
        const sign = direction === "asc" ? 1 : -1;
        return [...stocks].sort((a, b) => {
            const left = values[sortKey](a);
            const right = values[sortKey](b);
            return (left < right ? -1 : left > right ? 1 : 0) * sign;
        });
    }, [stocks, sortKey, direction]);

    const sparklines = useMemo(
        () =>
            Object.fromEntries(
                stocks.map(({ definition }) => [
                    definition.symbol,
                    getPriceSeries(definition.symbol, hour - HOURS_PER_DAY * DAYS_PER_WEEK, hour, SPARKLINE_POINTS).map((point) => point.price),
                ]),
            ),
        [stocks, hour],
    );

    const toggleSort = (key: SortKey) => {
        if (key === sortKey) {
            setDirection(direction === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setDirection(key === "symbol" ? "asc" : "desc");
        }
    };

    return (
        <>
            <PageHeader title="Market" description="Every listed company. Select one to see its chart, related news and place orders." />

            <Panel flush>
                <table className="data-table">
                    <thead>
                        <tr>
                            {COLUMNS.map((column) => (
                                <th key={column.key} className={column.align} aria-sort={sortKey === column.key ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                                    <button type="button" className={styles.sort} onClick={() => toggleSort(column.key)}>
                                        {column.label}
                                        {sortKey === column.key && <span aria-hidden="true">{direction === "asc" ? " ↑" : " ↓"}</span>}
                                    </button>
                                </th>
                            ))}
                            <th>7d trend</th>
                            <th className="right">Held</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(({ definition, quote }) => (
                            <tr key={definition.symbol} className="row-link">
                                <td>
                                    <Link to={`/market/${definition.symbol}`} className={styles.company}>
                                        <span className={styles.symbol}>{definition.symbol}</span>
                                        <span className={styles.name}>{definition.name}</span>
                                        <span className={styles.sector}>{SECTOR_LABELS[definition.sector]}</span>
                                    </Link>
                                </td>
                                <td className="right num">{formatMoney(quote.price)}</td>
                                <td className="right">
                                    <Delta value={quote.changePct24h} kind="percent" />
                                </td>
                                <td className="right">
                                    <Delta value={quote.changePct7d} kind="percent" />
                                </td>
                                <td>
                                    <Sparkline values={sparklines[definition.symbol]} />
                                </td>
                                <td className="right num">{positions[definition.symbol] ? formatInteger(positions[definition.symbol].shares) : "–"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Panel>
        </>
    );
};

export default Market;
