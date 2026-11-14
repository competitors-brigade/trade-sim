import { useMemo, useState } from "react";
import PageHeader from "@/Components/PageHeader/PageHeader";
import Panel from "@/Components/Panel/Panel";
import StatTile from "@/Components/StatTile/StatTile";
import Delta from "@/Components/Delta/Delta";
import { useAppSelector } from "@/Hooks/redux";
import useSimClock from "@/Hooks/useSimClock";
import { selectDailyPnl } from "@/Redux/selectors";
import { GAME_RULES } from "@/data/gameRules";
import { HOURS_PER_DAY, dayIndexOf, daysInMonth, monthOfHour } from "@/util/time/calendar";
import { formatMonthName, formatSimShortDate } from "@/util/time/format";
import CalendarGrid from "./CalendarGrid";
import styles from "./Calendar.module.css";

const MONTH_COUNT = 12;

const Calendar = () => {
    const { hour } = useSimClock();
    const dailyPnl = useAppSelector(selectDailyPnl);
    const [month, setMonth] = useState(() => monthOfHour(hour));

    const summary = useMemo(() => {
        const firstDay = dayIndexOf(month, 1);
        const entries = Array.from({ length: daysInMonth(month) }, (_, offset) => ({
            dayIndex: firstDay + offset,
            pnl: dailyPnl[firstDay + offset],
        })).filter((entry): entry is { dayIndex: number; pnl: number } => entry.pnl !== null);

        const net = entries.reduce((total, entry) => total + entry.pnl, 0);
        const best = entries.reduce<typeof entries[number] | null>((top, entry) => (!top || entry.pnl > top.pnl ? entry : top), null);
        const worst = entries.reduce<typeof entries[number] | null>((low, entry) => (!low || entry.pnl < low.pnl ? entry : low), null);

        return {
            net,
            green: entries.filter((entry) => entry.pnl > 0).length,
            red: entries.filter((entry) => entry.pnl < 0).length,
            best: best && best.pnl > 0 ? best : null,
            worst: worst && worst.pnl < 0 ? worst : null,
        };
    }, [dailyPnl, month]);

    const dayToHour = (dayIndex: number) => dayIndex * HOURS_PER_DAY;

    return (
        <>
            <PageHeader
                title="Calendar"
                description="Your profit or loss for each simulated day. Days are green when your account gained and red when it lost."
                actions={
                    <div className={styles.nav}>
                        <button type="button" className="button" onClick={() => setMonth(month - 1)} disabled={month === 0} aria-label="Previous month">
                            ←
                        </button>
                        <span className={styles.monthName}>
                            {formatMonthName(month)} {GAME_RULES.simulationYear}
                        </span>
                        <button type="button" className="button" onClick={() => setMonth(month + 1)} disabled={month === MONTH_COUNT - 1} aria-label="Next month">
                            →
                        </button>
                    </div>
                }
            />

            <div className={styles.tiles}>
                <StatTile label="Month P&L" value={<Delta value={summary.net} />} />
                <StatTile label="Green days" value={summary.green} />
                <StatTile label="Red days" value={summary.red} />
                <StatTile label="Best day" value={summary.best ? <Delta value={summary.best.pnl} /> : "–"} detail={summary.best ? formatSimShortDate(dayToHour(summary.best.dayIndex)) : undefined} />
                <StatTile label="Worst day" value={summary.worst ? <Delta value={summary.worst.pnl} /> : "–"} detail={summary.worst ? formatSimShortDate(dayToHour(summary.worst.dayIndex)) : undefined} />
            </div>

            <Panel flush>
                <CalendarGrid month={month} dailyPnl={dailyPnl} currentDay={Math.floor(hour / HOURS_PER_DAY)} />
            </Panel>
        </>
    );
};

export default Calendar;
