import { cx } from "@/util/ui/classNames";
import { formatPercent, formatSignedMoney } from "@/util/format/numbers";
import styles from "./Delta.module.css";

interface DeltaProps {
    value: number;
    kind?: "money" | "percent";
    className?: string;
}

const PRECISION = { money: 100, percent: 10000 } as const;

const Delta = ({ value, kind = "money", className }: DeltaProps) => {
    const rounded = Math.round(value * PRECISION[kind]) / PRECISION[kind];
    const tone = rounded > 0 ? styles.up : rounded < 0 ? styles.down : styles.flat;
    const text = kind === "money" ? formatSignedMoney(rounded) : formatPercent(rounded, { signed: true });

    return <span className={cx("num", styles.delta, tone, className)}>{text}</span>;
};

export default Delta;
export type { DeltaProps };
