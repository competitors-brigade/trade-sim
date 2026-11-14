import { GAME_RULES } from "@/data/gameRules";
import { clamp } from "@/util/math/numbers";
import { formatPercent } from "@/util/format/numbers";
import { cx } from "@/util/ui/classNames";
import styles from "./ReturnBand.module.css";

interface ReturnBandProps {
    returnPct: number;
}

const MIN = -GAME_RULES.maxLoss;
const MAX = GAME_RULES.maxGrowth;
const SPAN = MAX - MIN;

const toPercent = (value: number) => ((clamp(value, MIN, MAX) - MIN) / SPAN) * 100;

const ReturnBand = ({ returnPct }: ReturnBandProps) => {
    const zero = toPercent(0);
    const marker = toPercent(returnPct);

    return (
        <div className={styles.band}>
            <div className={styles.track}>
                <span
                    className={cx(styles.fill, returnPct >= 0 ? styles.gain : styles.loss)}
                    style={{ left: `${Math.min(zero, marker)}%`, width: `${Math.abs(marker - zero)}%` }}
                />
                <span className={styles.zero} style={{ left: `${zero}%` }} />
                <span className={styles.marker} style={{ left: `${marker}%` }} />
            </div>
            <div className={styles.labels}>
                <span>{formatPercent(MIN, { signed: true, digits: 0 })} loss floor</span>
                <span>{formatPercent(MAX, { signed: true, digits: 0 })} growth cap</span>
            </div>
        </div>
    );
};

export default ReturnBand;
export type { ReturnBandProps };
