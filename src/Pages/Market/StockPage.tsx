import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import Delta from "@/Components/Delta/Delta";
import EmptyState from "@/Components/EmptyState/EmptyState";
import CandlestickChart from "@/Components/CandlestickChart/CandlestickChart";
import LineChart from "@/Components/LineChart/LineChart";
import NewsItem from "@/Components/NewsItem/NewsItem";
import Panel from "@/Components/Panel/Panel";
import SegmentedControl from "@/Components/SegmentedControl/SegmentedControl";
import TradeTicket from "@/Components/TradeTicket/TradeTicket";
import { CHART_RANGES, CHART_TYPES, DEFAULT_CHART_RANGE, type ChartType } from "@/data/chartRanges";
import { SECTOR_LABELS } from "@/data/sectors";
import { useAppSelector } from "@/Hooks/redux";
import { useStock } from "@/Hooks/useMarket";
import { usePositions } from "@/Hooks/usePortfolio";
import { selectNews } from "@/Redux/selectors";
import { getCandles, getPriceSeries } from "@/services/market/Market";
import { formatInteger, formatMoney } from "@/util/format/numbers";
import { pickCandleInterval } from "@/util/chart/candleInterval";
import { formatDuration, formatSimDateTime, formatSimShortDate } from "@/util/time/format";
import styles from "./StockPage.module.css";

const CHART_POINTS = 240;
const NEWS_LIMIT = 8;

const rangeOptions = CHART_RANGES.map(({ value, label }) => ({ value, label }));

const StockPage = () => {
    const { symbol } = useParams();
    const stock = useStock(symbol);
    const position = usePositions()[symbol ?? ""];
    const news = useAppSelector(selectNews);
    const [rangeValue, setRangeValue] = useState(DEFAULT_CHART_RANGE);
    const [chartType, setChartType] = useState<ChartType>("line");

    const range = CHART_RANGES.find((candidate) => candidate.value === rangeValue) ?? CHART_RANGES[0];
    const hour = stock?.hour ?? 0;

    const points = useMemo(
        () =>
            symbol && stock
                ? getPriceSeries(symbol, Math.max(0, hour - range.hours), hour, CHART_POINTS).map((point) => ({ x: point.hour, y: point.price }))
                : [],
        [symbol, stock, hour, range.hours],
    );

    const candleInterval = pickCandleInterval(hour - Math.max(0, hour - range.hours));
    const candles = useMemo(
        () => (symbol && stock && chartType === "candles" ? getCandles(symbol, Math.max(0, hour - range.hours), hour, candleInterval) : []),
        [symbol, stock, chartType, hour, range.hours, candleInterval],
    );

    const related = useMemo(() => {
        if (!stock) return [];
        const { definition } = stock;
        return news
            .filter(
                (article) =>
                    article.symbol === definition.symbol || (article.scope === "sector" && article.sector === definition.sector) || article.scope === "market",
            )
            .slice(0, NEWS_LIMIT);
    }, [news, stock]);

    if (!stock) {
        return (
            <EmptyState
                title="Unknown company"
                description={`There is no listing with the symbol ${symbol ?? ""}.`}
                action={
                    <Link to="/market" className="button">
                        Back to market
                    </Link>
                }
            />
        );
    }

    const { definition, quote } = stock;

    return (
        <>
            <header className={styles.header}>
                <Link to="/market" className={styles.back}>
                    ← Market
                </Link>
                <div className={styles.titleRow}>
                    <h1 className={styles.title}>
                        <span className={styles.symbol}>{definition.symbol}</span> {definition.name}
                    </h1>
                    <p className={styles.sector}>{SECTOR_LABELS[definition.sector]}</p>
                </div>
                <div className={styles.priceRow}>
                    <span className={`num ${styles.price}`}>{formatMoney(quote.price)}</span>
                    <Delta value={quote.change24h} />
                    <Delta value={quote.changePct24h} kind="percent" />
                    <span className={styles.window}>24h</span>
                </div>
            </header>

            <div className={styles.layout}>
                <div className={styles.main}>
                    <Panel
                        title="Price history"
                        actions={
                            <>
                                <SegmentedControl label="Chart type" options={CHART_TYPES} value={chartType} onChange={setChartType} />
                                <SegmentedControl label="Chart range" options={rangeOptions} value={rangeValue} onChange={setRangeValue} />
                            </>
                        }
                    >
                        {chartType === "line" ? (
                            <LineChart
                                points={points}
                                formatY={formatMoney}
                                formatTick={formatSimShortDate}
                                formatTooltip={formatSimDateTime}
                                emptyMessage="Advance the simulation to build a price history."
                            />
                        ) : (
                            <>
                                <CandlestickChart
                                    candles={candles}
                                    formatY={formatMoney}
                                    formatTick={formatSimShortDate}
                                    formatTooltip={formatSimDateTime}
                                    emptyMessage="Advance the simulation to build a price history."
                                />
                                <p className={styles.caption}>{formatDuration(candleInterval)} per candle</p>
                            </>
                        )}
                    </Panel>

                    <Panel title="Related news">
                        {related.length === 0 ? (
                            <EmptyState title="Nothing yet" description="No headlines affecting this company have been published so far." />
                        ) : (
                            related.map((article) => <NewsItem key={article.id} article={article} compact />)
                        )}
                    </Panel>
                </div>

                <div className={styles.side}>
                    <Panel title="Trade">
                        <TradeTicket symbol={definition.symbol} price={quote.price} />
                    </Panel>

                    <Panel title="Your position">
                        {position ? (
                            <dl className={styles.position}>
                                <div>
                                    <dt>Shares</dt>
                                    <dd className="num">{formatInteger(position.shares)}</dd>
                                </div>
                                <div>
                                    <dt>Average cost</dt>
                                    <dd className="num">{formatMoney(position.avgCost)}</dd>
                                </div>
                                <div>
                                    <dt>Market value</dt>
                                    <dd className="num">{formatMoney(position.shares * quote.price)}</dd>
                                </div>
                                <div>
                                    <dt>Unrealized P&amp;L</dt>
                                    <dd>
                                        <Delta value={(quote.price - position.avgCost) * position.shares} />
                                    </dd>
                                </div>
                            </dl>
                        ) : (
                            <p className={styles.muted}>You don&apos;t hold any {definition.symbol}.</p>
                        )}
                    </Panel>
                </div>
            </div>
        </>
    );
};

export default StockPage;
