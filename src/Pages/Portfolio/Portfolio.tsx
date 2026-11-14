import { useMemo } from "react";
import { Link } from "react-router";
import Delta from "@/Components/Delta/Delta";
import EmptyState from "@/Components/EmptyState/EmptyState";
import PageHeader from "@/Components/PageHeader/PageHeader";
import Panel from "@/Components/Panel/Panel";
import StatTile from "@/Components/StatTile/StatTile";
import { STOCKS_BY_SYMBOL } from "@/data/stocks";
import { useStockList } from "@/Hooks/useMarket";
import { usePortfolioSummary, usePositions, useTrades } from "@/Hooks/usePortfolio";
import { formatInteger, formatMoney, formatPercent } from "@/util/format/numbers";
import { formatSimDateTime } from "@/util/time/format";
import styles from "./Portfolio.module.css";

const TRADE_HISTORY_LIMIT = 100;

const Portfolio = () => {
    const summary = usePortfolioSummary();
    const positions = usePositions();
    const trades = useTrades();
    const stocks = useStockList();

    const holdings = useMemo(
        () =>
            stocks
                .filter(({ definition }) => positions[definition.symbol])
                .map(({ definition, quote }) => {
                    const position = positions[definition.symbol];
                    const value = position.shares * quote.price;
                    return { definition, quote, position, value, pnl: (quote.price - position.avgCost) * position.shares };
                })
                .sort((a, b) => b.value - a.value),
        [stocks, positions],
    );

    return (
        <>
            <PageHeader title="Portfolio" description="What you own, what you paid, and every order you have placed." />

            <div className={styles.tiles}>
                <StatTile label="Cash" value={formatMoney(summary.cash)} />
                <StatTile label="Invested" value={formatMoney(summary.holdingsValue)} />
                <StatTile label="Unrealized P&L" value={<Delta value={summary.unrealizedPnl} />} />
            </div>

            <div className={styles.stack}>
                <Panel title="Holdings" flush>
                    {holdings.length === 0 ? (
                        <EmptyState title="No open positions" description="Orders you place on a company's page will show up here." action={<Link to="/market" className="button">Browse market</Link>} />
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th className="right">Shares</th>
                                    <th className="right">Avg cost</th>
                                    <th className="right">Price</th>
                                    <th className="right">Value</th>
                                    <th className="right">Weight</th>
                                    <th className="right">P&amp;L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holdings.map(({ definition, quote, position, value, pnl }) => (
                                    <tr key={definition.symbol} className="row-link">
                                        <td>
                                            <Link to={`/market/${definition.symbol}`} className={styles.symbol}>
                                                {definition.symbol}
                                            </Link>
                                        </td>
                                        <td className="right num">{formatInteger(position.shares)}</td>
                                        <td className="right num">{formatMoney(position.avgCost)}</td>
                                        <td className="right num">{formatMoney(quote.price)}</td>
                                        <td className="right num">{formatMoney(value)}</td>
                                        <td className="right num">{formatPercent(summary.holdingsValue ? value / summary.holdingsValue : 0, { digits: 1 })}</td>
                                        <td className="right">
                                            <Delta value={pnl} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Panel>

                <Panel title="Order history" flush>
                    {trades.length === 0 ? (
                        <EmptyState title="No orders yet" />
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Side</th>
                                    <th>Symbol</th>
                                    <th className="right">Shares</th>
                                    <th className="right">Price</th>
                                    <th className="right">Total</th>
                                    <th className="right">Realized P&amp;L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trades.slice(0, TRADE_HISTORY_LIMIT).map((trade) => (
                                    <tr key={trade.id}>
                                        <td className="num">{formatSimDateTime(trade.hour)}</td>
                                        <td className={trade.side === "buy" ? styles.buy : styles.sell}>{trade.side === "buy" ? "Buy" : "Sell"}</td>
                                        <td>
                                            <Link to={`/market/${trade.symbol}`} className={styles.symbol} title={STOCKS_BY_SYMBOL[trade.symbol]?.name}>
                                                {trade.symbol}
                                            </Link>
                                        </td>
                                        <td className="right num">{formatInteger(trade.shares)}</td>
                                        <td className="right num">{formatMoney(trade.price)}</td>
                                        <td className="right num">{formatMoney(trade.shares * trade.price)}</td>
                                        <td className="right">{trade.side === "sell" ? <Delta value={trade.realizedPnl} /> : <span className={styles.muted}>–</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Panel>
            </div>
        </>
    );
};

export default Portfolio;
