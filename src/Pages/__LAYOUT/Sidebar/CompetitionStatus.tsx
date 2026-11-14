import { GAME_RULES } from "@/data/gameRules";
import { COMPETITION_WINDOW, getCompetitionPhase, getCompetitionWeek } from "@/util/competition/phase";
import type { CompetitionPhase } from "@/types/game";
import styles from "./Sidebar.module.css";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

const PHASE_LABELS: Record<CompetitionPhase, string> = {
    upcoming: "Starts soon",
    open: "Competition live",
    closed: "Competition ended",
};

const CompetitionStatus = () => {
    const now = new Date();
    const phase = getCompetitionPhase(now);
    const week = getCompetitionWeek(now);

    return (
        <div className={styles.status}>
            <p className={styles.statusLabel}>{PHASE_LABELS[phase]}</p>
            {COMPETITION_WINDOW ? (
                <p className={styles.statusDetail}>
                    {phase === "open" && week ? `Week ${week} of ${GAME_RULES.competitionWeeks} · ` : ""}
                    {dateFormat.format(COMPETITION_WINDOW.start)} – {dateFormat.format(COMPETITION_WINDOW.end)}
                </p>
            ) : (
                <p className={styles.statusDetail}>{GAME_RULES.competitionWeeks}-week season, no dates set</p>
            )}
        </div>
    );
};

export default CompetitionStatus;
