import { GAME_RULES } from "@/data/gameRules";
import Delta from "@/Components/Delta/Delta";
import { usePortfolioSummary } from "@/Hooks/usePortfolio";
import useSimClock from "@/Hooks/useSimClock";
import { formatInteger, formatMoney } from "@/util/format/numbers";
import { formatSimTime, formatSimWeekdayDate } from "@/util/time/format";
import AdvanceControls from "./AdvanceControls";
import styles from "./SimulationBar.module.css";

const SimulationBar = () => {
    const { hour, progress, finished } = useSimClock();
    const { scoredEquity, returnPct } = usePortfolioSummary();

    return (
        <header className={styles.bar}>
            <div className={styles.clock}>
                <span className={styles.label}>{finished ? "Year complete" : "Simulation time"}</span>
                <span className={`num ${styles.date}`}>
                    {formatSimWeekdayDate(hour)}
                    {!finished && <span className={styles.time}> {formatSimTime(hour)}</span>}
                </span>
                <span className={styles.hours}>
                    Hour {formatInteger(hour)} of {formatInteger(GAME_RULES.hoursPerYear)}
                </span>
            </div>

            <div className={styles.account}>
                <span className={styles.label}>Account</span>
                <span className={`num ${styles.equity}`}>{formatMoney(scoredEquity)}</span>
                <Delta value={returnPct} kind="percent" />
            </div>

            <AdvanceControls />

            <div
                className={styles.progress}
                role="progressbar"
                aria-label="Year progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
            >
                <span style={{ width: `${progress * 100}%` }} />
            </div>
        </header>
    );
};

export default SimulationBar;
