import { useMemo } from "react";
import { Link } from "react-router";
import Delta from "@/Components/Delta/Delta";
import EmptyState from "@/Components/EmptyState/EmptyState";
import LineChart from "@/Components/LineChart/LineChart";
import NewsItem from "@/Components/NewsItem/NewsItem";
import PageHeader from "@/Components/PageHeader/PageHeader";
import Panel from "@/Components/Panel/Panel";
import StatTile from "@/Components/StatTile/StatTile";
import { GAME_RULES } from "@/data/gameRules";
import { useAppSelector } from "@/Hooks/redux";
import { useStockList } from "@/Hooks/useMarket";
import { usePortfolioSummary, usePositions } from "@/Hooks/usePortfolio";
import useSimClock from "@/Hooks/useSimClock";
import { selectEquityByDay, selectNews } from "@/Redux/selectors";
import { formatInteger, formatMoney, formatPercent, formatWholeMoney } from "@/util/format/numbers";
import { HOURS_PER_DAY } from "@/util/time/calendar";
import { formatSimDateTime, formatSimShortDate } from "@/util/time/format";
import { clampEquity } from "@/util/portfolio/valuation";
import ReturnBand from "./ReturnBand";
import styles from "./Dashboard.module.css";

const NEWS_PREVIEW_COUNT = 5;
const MOVER_COUNT = 3;
const HOLDING_PREVIEW_COUNT = 5;

const Dashboard = () => {
    const summary = usePortfolioSummary();
    const { hour, finished } = useSimClock();
    const equityByDay = useAppSelector(selectEquityByDay);
    const news = useAppSelector(selectNews);
    const positions = usePositions();
    const stocks = useStockList();

    const points = useMemo(() => {
        const series = equityByDay.map((equity, day) => ({ x: day * HOURS_PER_DAY, y: clampEquity(equity) }));
        if (hour % HOURS_PER_DAY !== 0) series.push({ x: hour, y: summary.scoredEquity });
        return series;
    }, [equityByDay, hour, summary.scoredEquity]);

    const movers = useMemo(() => {
        const sorted = [...stocks].sort((a, b) => b.quote.changePct24h - a.quote.changePct24h);
        return { gainers: sorted.slice(0, MOVER_COUNT), losers: sorted.slice(-MOVER_COUNT).reverse() };
    }, [stocks]);

    const holdings = useMemo(
        () =>
            stocks
                .filter(({ definition }) => positions[definition.symbol])
                .map(({ definition, quote }) => {
                    const position = positions[definition.symbol];
                    return { definition, quote, position, value: position.shares * quote.price };
                })
                .sort((a, b) => b.value - a.value)
                .slice(0, HOLDING_PREVIEW_COUNT),
        [stocks, positions],
    );

    return (
        <>
            <PageHeader title="Dashboard" description="Your account at a glance. Read the news, then make your moves before advancing time." />

            {finished && (
                <p className={styles.banner}>
                    The year is complete. Your final return is <strong>{formatPercent(summary.returnPct, { signed: true })}</strong>.
                </p>
            )}

            <div className={styles.tiles}>
                <StatTile label="Account value" value={formatMoney(summary.scoredEquity)} detail={`Started at ${formatWholeMoney(GAME_RULES.startingCash)}`} />
                <StatTile label="Total return" value={<Delta value={summary.returnPct} kind="percent" />} detail={summary.capped ? (summary.capped === "growth" ? "Growth cap reached" : "Loss floor reached") : "Counts toward the leaderboard"} />
                <StatTile label="Today" value={<Delta value={summary.dayPnl} />} detail="Since the start of this day" />
                <StatTile label="Cash" value={formatMoney(summary.cash)} detail={`${formatMoney(summary.holdingsValue)} invested`} />
            </div>

            <div className={styles.grid}>
                <Panel title="Account value">
                    <LineChart
                        points={points}
                        baseline={GAME_RULES.startingCash}
                        formatY={formatWholeMoney}
                        formatTick={formatSimShortDate}
                        formatTooltip={formatSimDateTime}
                        emptyMessage="Advance the simulation to start building your account history."
                    />
                    <ReturnBand returnPct={summary.returnPct} />
                </Panel>

                <Panel
                    title="Latest news"
                    actions={
                        <Link to="/news" className={styles.link}>
                            All news
                        </Link>
                    }
                >
                    {news.length === 0 ? (
                        <EmptyState title="No news yet" description="Headlines start arriving as time passes." />
                    ) : (
                        news.slice(0, NEWS_PREVIEW_COUNT).map((article) => <NewsItem key={article.id} article={article} compact />)
                    )}
                </Panel>

                <Panel title="Holdings" flush>
                    {holdings.length === 0 ? (
                        <EmptyState title="No positions" description="Pick a stock from the market page to place your first trade." action={<Link to="/market" className="button">Browse market</Link>} />
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th className="right">Shares</th>
                                    <th className="right">Value</th>
                                    <th className="right">P&amp;L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holdings.map(({ definition, quote, position, value }) => (
                                    <tr key={definition.symbol} className="row-link">
                                        <td>
                                            <Link to={`/market/${definition.symbol}`} className={styles.symbol}>
                                                {definition.symbol}
                                            </Link>
                                        </td>
                                        <td className="right num">{formatInteger(position.shares)}</td>
                                        <td className="right num">{formatMoney(value)}</td>
                                        <td className="right">
                                            <Delta value={(quote.price - position.avgCost) * position.shares} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Panel>

                <Panel title="Movers, last 24 hours">
                    <div className={styles.moverColumns}>
                        {[
                            { heading: "Gainers", rows: movers.gainers },
                            { heading: "Decliners", rows: movers.losers },
                        ].map(({ heading, rows }) => (
                            <div key={heading}>
                                <p className={styles.moverHeading}>{heading}</p>
                                <ul className={styles.moverList}>
                                    {rows.map(({ definition, quote }) => (
                                        <li key={definition.symbol}>
                                            <Link to={`/market/${definition.symbol}`} className={styles.symbol}>
                                                {definition.symbol}
                                            </Link>
                                            <Delta value={quote.changePct24h} kind="percent" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>
        </>
    );
};

export default Dashboard;
