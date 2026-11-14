import { useMemo } from "react";
import Delta from "@/Components/Delta/Delta";
import EmptyState from "@/Components/EmptyState/EmptyState";
import PageHeader from "@/Components/PageHeader/PageHeader";
import Panel from "@/Components/Panel/Panel";
import StatTile from "@/Components/StatTile/StatTile";
import { GAME_RULES } from "@/data/gameRules";
import { useAppDispatch, useAppSelector } from "@/Hooks/redux";
import useSimClock from "@/Hooks/useSimClock";
import { fetchLeaderboard } from "@/Redux/Slices/leaderboardSlice";
import leaderboardService from "@/services/leaderboard/LeaderboardService";
import { getEqualWeightReturn } from "@/services/market/Market";
import { COMPETITION_WINDOW, getCompetitionPhase } from "@/util/competition/phase";
import { formatMoney, formatPercent } from "@/util/format/numbers";
import { cx } from "@/util/ui/classNames";
import type { CompetitionPhase } from "@/types/game";
import styles from "./Leaderboard.module.css";

const PHASE_NOTES: Record<CompetitionPhase, string> = {
    upcoming: "The competition has not started yet. You can practice, but scores are not recorded.",
    open: "The competition is live. Your score updates every time you advance the clock.",
    closed: "The competition has ended. Scores are no longer recorded.",
};

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

const Leaderboard = () => {
    const dispatch = useAppDispatch();
    const { entries, status, error } = useAppSelector((state) => state.leaderboard);
    const playerId = useAppSelector((state) => state.auth.user?.id);
    const { hour } = useSimClock();
    const phase = getCompetitionPhase();

    const ranked = useMemo(() => [...entries].sort((a, b) => b.returnPct - a.returnPct), [entries]);
    const benchmark = getEqualWeightReturn(hour);

    return (
        <>
            <PageHeader
                title="Leaderboard"
                description="Highest return wins. Standings are final once a trader has played through the full year."
                actions={
                    <button type="button" className="button" onClick={() => void dispatch(fetchLeaderboard())} disabled={status === "loading"}>
                        {status === "loading" ? "Refreshing…" : "Refresh"}
                    </button>
                }
            />

            <div className={styles.tiles}>
                <StatTile
                    label="Competition"
                    value={phase === "open" ? "Live" : phase === "upcoming" ? "Not started" : "Ended"}
                    detail={COMPETITION_WINDOW ? `${dateFormat.format(COMPETITION_WINDOW.start)} – ${dateFormat.format(COMPETITION_WINDOW.end)}` : `${GAME_RULES.competitionWeeks} weeks`}
                />
                <StatTile label="Market benchmark" value={<Delta value={benchmark} kind="percent" />} detail="Equal-weight, buy and hold, at your current date" />
                <StatTile label="Traders" value={ranked.length} detail={leaderboardService.source === "supabase" ? "Synced with Supabase" : "Stored in this browser only"} />
            </div>

            <p className={styles.note}>{PHASE_NOTES[phase]}</p>
            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}

            <Panel flush>
                {ranked.length === 0 ? (
                    <EmptyState title="No scores yet" description="Advance the simulation to post your first score." />
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="right">Rank</th>
                                <th>Trader</th>
                                <th className="right">Return</th>
                                <th className="right">Account value</th>
                                <th className="right">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ranked.map((entry, index) => {
                                const finished = entry.hour >= GAME_RULES.hoursPerYear;
                                return (
                                    <tr key={entry.playerId} className={cx(entry.playerId === playerId && styles.you)}>
                                        <td className={cx("right num", styles.rank)}>{index + 1}</td>
                                        <td>
                                            {entry.name}
                                            {entry.playerId === playerId && <span className={styles.badge}>You</span>}
                                        </td>
                                        <td className="right">
                                            <Delta value={entry.returnPct} kind="percent" />
                                        </td>
                                        <td className="right num">{formatMoney(entry.equity)}</td>
                                        <td className="right num">{finished ? <span className={styles.final}>Final</span> : formatPercent(entry.hour / GAME_RULES.hoursPerYear, { digits: 0 })}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </Panel>
        </>
    );
};

export default Leaderboard;
