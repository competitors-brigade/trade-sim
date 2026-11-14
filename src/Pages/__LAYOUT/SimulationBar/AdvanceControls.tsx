import { useState } from "react";
import { GAME_RULES } from "@/data/gameRules";
import { TIME_PRESETS } from "@/data/timePresets";
import { useAppDispatch } from "@/Hooks/redux";
import useSimClock from "@/Hooks/useSimClock";
import advanceTime from "@/Redux/Thunks/advanceTime";
import { formatInteger } from "@/util/format/numbers";
import { formatSimDateTime } from "@/util/time/format";
import { cx } from "@/util/ui/classNames";
import styles from "./AdvanceControls.module.css";

const AdvanceControls = () => {
    const dispatch = useAppDispatch();
    const { hour, remaining, finished } = useSimClock();
    const [customHours, setCustomHours] = useState("");
    const [previewHours, setPreviewHours] = useState<number | null>(null);

    const customValue = Number.parseInt(customHours, 10);
    const customValid = Number.isFinite(customValue) && customValue > 0;

    const advance = (hours: number) => {
        dispatch(advanceTime(hours));
        setPreviewHours(null);
    };

    const previewTarget = previewHours === null ? null : Math.min(hour + previewHours, GAME_RULES.hoursPerYear);

    if (finished) {
        return <p className={styles.finished}>The year is over. Check the leaderboard for final standings.</p>;
    }

    return (
        <div className={styles.controls}>
            <div className={styles.row}>
                <span className={styles.label}>Advance</span>
                <div className={styles.presets}>
                    {TIME_PRESETS.map((preset) => {
                        const hours = preset.resolve(hour);
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                className={styles.preset}
                                title={`${preset.title} (${formatInteger(Math.min(hours, remaining))} hours)`}
                                onClick={() => advance(hours)}
                                onMouseEnter={() => setPreviewHours(hours)}
                                onMouseLeave={() => setPreviewHours(null)}
                                onFocus={() => setPreviewHours(hours)}
                                onBlur={() => setPreviewHours(null)}
                            >
                                +{preset.label}
                            </button>
                        );
                    })}
                </div>
                <form
                    className={styles.custom}
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (customValid) {
                            advance(customValue);
                            setCustomHours("");
                        }
                    }}
                >
                    <input
                        className={cx("field", "num", styles.input)}
                        inputMode="numeric"
                        placeholder="Hours"
                        aria-label="Custom number of hours to advance"
                        value={customHours}
                        onChange={(event) => setCustomHours(event.target.value.replace(/\D/g, ""))}
                        onFocus={() => customValid && setPreviewHours(customValue)}
                    />
                    <button type="submit" className="button" disabled={!customValid}>
                        Go
                    </button>
                </form>
            </div>
            <p className={styles.preview} aria-live="polite">
                {previewTarget !== null ? `Advances to ${formatSimDateTime(previewTarget)} (hour ${formatInteger(previewTarget)})` : " "}
            </p>
        </div>
    );
};

export default AdvanceControls;
