import { COMPETITION_START } from "@/config/env";
import { GAME_RULES } from "@/data/gameRules";
import type { CompetitionPhase } from "@/types/game";

const MS_PER_WEEK = 7 * 24 * 3_600_000;

interface CompetitionWindow {
    start: Date;
    end: Date;
}

const parseWindow = (): CompetitionWindow | null => {
    if (!COMPETITION_START) return null;
    const start = new Date(`${COMPETITION_START}T00:00:00`);
    if (Number.isNaN(start.getTime())) return null;
    return { start, end: new Date(start.getTime() + GAME_RULES.competitionWeeks * MS_PER_WEEK) };
};

const COMPETITION_WINDOW = parseWindow();

const getCompetitionPhase = (now: Date = new Date()): CompetitionPhase => {
    if (!COMPETITION_WINDOW) return "open";
    if (now < COMPETITION_WINDOW.start) return "upcoming";
    if (now >= COMPETITION_WINDOW.end) return "closed";
    return "open";
};

const getCompetitionWeek = (now: Date = new Date()) => {
    if (!COMPETITION_WINDOW) return null;
    const elapsed = now.getTime() - COMPETITION_WINDOW.start.getTime();
    const week = Math.floor(elapsed / MS_PER_WEEK) + 1;
    return Math.min(Math.max(week, 1), GAME_RULES.competitionWeeks);
};

export { COMPETITION_WINDOW, getCompetitionPhase, getCompetitionWeek };
export type { CompetitionWindow };
