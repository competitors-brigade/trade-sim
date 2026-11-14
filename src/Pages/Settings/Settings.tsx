import { useState } from "react";
import PageHeader from "@/Components/PageHeader/PageHeader";
import Panel from "@/Components/Panel/Panel";
import SegmentedControl from "@/Components/SegmentedControl/SegmentedControl";
import { GAME_RULES } from "@/data/gameRules";
import { THEME_OPTIONS } from "@/data/themes";
import { STOCKS } from "@/data/stocks";
import { MARKET_SEED } from "@/config/env";
import { useAppDispatch, useAppSelector } from "@/Hooks/redux";
import { simulationReset } from "@/Redux/actions";
import { submitScore } from "@/Redux/Slices/leaderboardSlice";
import { updateDisplayName } from "@/Redux/Slices/authSlice";
import { themeChanged } from "@/Redux/Slices/settingsSlice";
import { formatInteger, formatPercent, formatWholeMoney } from "@/util/format/numbers";
import type { ReactNode } from "react";
import styles from "./Settings.module.css";

const MAX_NAME_LENGTH = 32;

const RULES: ReadonlyArray<{ label: string; value: ReactNode }> = [
    { label: "Starting capital", value: formatWholeMoney(GAME_RULES.startingCash) },
    { label: "Simulated year", value: `${formatInteger(GAME_RULES.hoursPerYear)} hours (${GAME_RULES.simulationYear})` },
    { label: "Growth cap", value: `${formatPercent(GAME_RULES.maxGrowth, { signed: true, digits: 0 })} across the year` },
    { label: "Loss limit", value: `${formatPercent(-GAME_RULES.maxLoss, { digits: 0 })} across the year` },
    { label: "Listed companies", value: STOCKS.length },
    { label: "Market seed", value: MARKET_SEED },
];

const Settings = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.settings.theme);
    const { user, busy, error } = useAppSelector((state) => state.auth);
    const [name, setName] = useState(user?.displayName ?? "");
    const [confirmingReset, setConfirmingReset] = useState(false);

    const trimmed = name.trim();

    const saveName = async () => {
        if (!trimmed || trimmed === user?.displayName) return;
        const result = await dispatch(updateDisplayName(trimmed));
        if (updateDisplayName.fulfilled.match(result)) void dispatch(submitScore());
    };

    return (
        <>
            <PageHeader title="Settings" />

            <div className={styles.stack}>
                <Panel title="Profile">
                    <form
                        className={styles.form}
                        onSubmit={(event) => {
                            event.preventDefault();
                            void saveName();
                        }}
                    >
                        <label className={styles.field}>
                            <span className={styles.label}>Leaderboard name</span>
                            <input className="field" value={name} maxLength={MAX_NAME_LENGTH} onChange={(event) => setName(event.target.value)} />
                        </label>
                        <button type="submit" className="button" disabled={busy || !trimmed || trimmed === user?.displayName}>
                            Save
                        </button>
                    </form>
                    {user?.email && <p className={styles.email}>Signed in as {user.email}</p>}
                    {error && (
                        <p className={styles.error} role="alert">
                            {error}
                        </p>
                    )}
                </Panel>

                <Panel title="Appearance">
                    <SegmentedControl label="Theme" options={THEME_OPTIONS} value={theme} onChange={(next) => dispatch(themeChanged(next))} />
                </Panel>

                <Panel title="Game rules">
                    <dl className={styles.rules}>
                        {RULES.map(({ label, value }) => (
                            <div key={label}>
                                <dt>{label}</dt>
                                <dd className="num">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </Panel>

                <Panel title="Restart">
                    <p className={styles.help}>Start the year over with fresh capital. Your trade history and account curve are cleared. Your leaderboard row is replaced the next time you advance the clock.</p>
                    {confirmingReset ? (
                        <div className={styles.confirm}>
                            <button
                                type="button"
                                className="button danger"
                                onClick={() => {
                                    dispatch(simulationReset());
                                    setConfirmingReset(false);
                                }}
                            >
                                Yes, restart the year
                            </button>
                            <button type="button" className="button" onClick={() => setConfirmingReset(false)}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button type="button" className="button" onClick={() => setConfirmingReset(true)}>
                            Restart simulation
                        </button>
                    )}
                </Panel>
            </div>
        </>
    );
};

export default Settings;
