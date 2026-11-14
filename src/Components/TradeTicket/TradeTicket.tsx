import { useState } from "react";
import { useAppDispatch } from "@/Hooks/redux";
import { usePortfolioSummary, usePositions } from "@/Hooks/usePortfolio";
import useSimClock from "@/Hooks/useSimClock";
import placeOrder from "@/Redux/Thunks/placeOrder";
import SegmentedControl from "@/Components/SegmentedControl/SegmentedControl";
import { formatInteger, formatMoney } from "@/util/format/numbers";
import { cx } from "@/util/ui/classNames";
import type { OrderSide } from "@/types/game";
import styles from "./TradeTicket.module.css";

interface TradeTicketProps {
    symbol: string;
    price: number;
}

interface Feedback {
    tone: "success" | "error";
    text: string;
}

const SIDE_OPTIONS: ReadonlyArray<{ value: OrderSide; label: string }> = [
    { value: "buy", label: "Buy" },
    { value: "sell", label: "Sell" },
];

const QUICK_FRACTIONS = [
    { label: "25%", fraction: 0.25 },
    { label: "50%", fraction: 0.5 },
    { label: "75%", fraction: 0.75 },
    { label: "Max", fraction: 1 },
] as const;

const TradeTicket = ({ symbol, price }: TradeTicketProps) => {
    const dispatch = useAppDispatch();
    const { cash } = usePortfolioSummary();
    const position = usePositions()[symbol];
    const { finished } = useSimClock();

    const [side, setSide] = useState<OrderSide>("buy");
    const [quantity, setQuantity] = useState("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const shares = Number.parseInt(quantity, 10);
    const validShares = Number.isFinite(shares) && shares > 0 ? shares : 0;
    const maxShares = side === "buy" ? Math.floor(cash / price) : (position?.shares ?? 0);

    const updateQuantity = (value: string) => {
        setQuantity(value.replace(/\D/g, ""));
        setFeedback(null);
    };

    const submit = () => {
        const result = dispatch(placeOrder({ symbol, side, shares: validShares }));
        if (result.ok) {
            const { trade } = result;
            setFeedback({
                tone: "success",
                text: `${side === "buy" ? "Bought" : "Sold"} ${formatInteger(trade.shares)} ${symbol} at ${formatMoney(trade.price)}.`,
            });
            setQuantity("");
        } else {
            setFeedback({ tone: "error", text: result.reason });
        }
    };

    return (
        <form
            className={styles.ticket}
            onSubmit={(event) => {
                event.preventDefault();
                submit();
            }}
        >
            <SegmentedControl
                label="Order side"
                options={SIDE_OPTIONS}
                value={side}
                onChange={(next) => {
                    setSide(next);
                    setFeedback(null);
                }}
            />

            <label className={styles.field}>
                <span className={styles.label}>Shares</span>
                <input
                    className="field num"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0"
                    value={quantity}
                    onChange={(event) => updateQuantity(event.target.value)}
                />
            </label>

            <div className={styles.quick}>
                {QUICK_FRACTIONS.map(({ label, fraction }) => (
                    <button
                        key={label}
                        type="button"
                        className={styles.quickButton}
                        disabled={maxShares === 0}
                        onClick={() => updateQuantity(String(Math.max(1, Math.floor(maxShares * fraction))))}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <dl className={styles.summary}>
                <div>
                    <dt>Market price</dt>
                    <dd className="num">{formatMoney(price)}</dd>
                </div>
                <div>
                    <dt>{side === "buy" ? "Estimated cost" : "Estimated proceeds"}</dt>
                    <dd className="num">{formatMoney(validShares * price)}</dd>
                </div>
                <div>
                    <dt>{side === "buy" ? "Buying power" : "Shares held"}</dt>
                    <dd className="num">{side === "buy" ? formatMoney(cash) : formatInteger(maxShares)}</dd>
                </div>
            </dl>

            <button type="submit" className="button primary" disabled={finished || validShares === 0}>
                {side === "buy" ? "Buy" : "Sell"} {symbol}
            </button>

            {feedback && (
                <p role="status" className={cx(styles.feedback, feedback.tone === "success" ? styles.success : styles.error)}>
                    {feedback.text}
                </p>
            )}
        </form>
    );
};

export default TradeTicket;
export type { TradeTicketProps };
