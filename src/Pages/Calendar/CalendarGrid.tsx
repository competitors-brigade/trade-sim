import { useMemo, type CSSProperties } from "react";
import { DAYS_PER_WEEK, dayIndexOf, daysInMonth, firstWeekdayOfMonth } from "@/util/time/calendar";
import { formatCompactSignedMoney } from "@/util/format/numbers";
import { cx } from "@/util/ui/classNames";
import styles from "./CalendarGrid.module.css";

interface CalendarGridProps {
    month: number;
    dailyPnl: Array<number | null>;
    currentDay: number;
}

interface DayCell {
    day: number;
    dayIndex: number;
    pnl: number | null;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MIN_TINT = 12;
const MAX_TINT = 62;

const CalendarGrid = ({ month, dailyPnl, currentDay }: CalendarGridProps) => {
    const { weeks, maxAbs } = useMemo(() => {
        const offset = firstWeekdayOfMonth(month);
        const firstDay = dayIndexOf(month, 1);
        const cells: Array<DayCell | null> = Array.from({ length: offset }, () => null);

        for (let day = 1; day <= daysInMonth(month); day++) {
            const dayIndex = firstDay + day - 1;
            cells.push({ day, dayIndex, pnl: dailyPnl[dayIndex] });
        }
        while (cells.length % DAYS_PER_WEEK !== 0) cells.push(null);

        const grouped = Array.from({ length: cells.length / DAYS_PER_WEEK }, (_, week) => cells.slice(week * DAYS_PER_WEEK, (week + 1) * DAYS_PER_WEEK));
        const peak = Math.max(0, ...cells.map((cell) => Math.abs(cell?.pnl ?? 0)));
        return { weeks: grouped, maxAbs: peak };
    }, [month, dailyPnl]);

    return (
        <div className={styles.grid} role="table" aria-label="Daily profit and loss">
            <div className={styles.row} role="row">
                {WEEKDAYS.map((weekday) => (
                    <div key={weekday} className={styles.weekday} role="columnheader">
                        {weekday}
                    </div>
                ))}
                <div className={cx(styles.weekday, styles.totalHead)} role="columnheader">
                    Week
                </div>
            </div>

            {weeks.map((week, index) => {
                const total = week.reduce((sum, cell) => sum + (cell?.pnl ?? 0), 0);
                const hasData = week.some((cell) => cell?.pnl != null);

                return (
                    <div key={index} className={styles.row} role="row">
                        {week.map((cell, cellIndex) => {
                            if (!cell) return <div key={cellIndex} className={styles.blank} role="cell" />;

                            const { pnl } = cell;
                            const tint = pnl && maxAbs ? MIN_TINT + (MAX_TINT - MIN_TINT) * (Math.abs(pnl) / maxAbs) : 0;
                            const live = cell.dayIndex === currentDay && pnl !== null;

                            return (
                                <div
                                    key={cellIndex}
                                    role="cell"
                                    className={cx(styles.cell, pnl === null && styles.future, pnl !== null && pnl > 0 && styles.gain, pnl !== null && pnl < 0 && styles.loss, live && styles.live)}
                                    style={{ "--tint": tint } as CSSProperties}
                                    title={live ? "Day in progress" : undefined}
                                >
                                    <span className={styles.day}>{cell.day}</span>
                                    {pnl !== null && <span className={cx("num", styles.pnl)}>{pnl === 0 ? "–" : formatCompactSignedMoney(pnl)}</span>}
                                </div>
                            );
                        })}
                        <div
                            role="cell"
                            className={cx("num", styles.total, hasData && total > 0 && styles.totalGain, hasData && total < 0 && styles.totalLoss)}
                        >
                            {hasData && total !== 0 ? formatCompactSignedMoney(total) : ""}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CalendarGrid;
export type { CalendarGridProps };
