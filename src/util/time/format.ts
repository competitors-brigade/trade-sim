import { GAME_RULES } from "@/data/gameRules";
import { hourToDate, HOURS_PER_DAY, DAYS_PER_WEEK } from "./calendar";

const utcFormat = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options });

const fullDate = utcFormat({ month: "short", day: "numeric", year: "numeric" });
const shortDate = utcFormat({ month: "short", day: "numeric" });
const weekdayDate = utcFormat({ weekday: "short", month: "short", day: "numeric", year: "numeric" });
const longDay = utcFormat({ weekday: "long", month: "long", day: "numeric" });
const monthName = utcFormat({ month: "long" });

const formatSimDate = (hour: number) => fullDate.format(hourToDate(hour));
const formatSimShortDate = (hour: number) => shortDate.format(hourToDate(hour));
const formatSimWeekdayDate = (hour: number) => weekdayDate.format(hourToDate(hour));
const formatSimLongDay = (hour: number) => longDay.format(hourToDate(hour));
const formatSimTime = (hour: number) => `${String(hourToDate(hour).getUTCHours()).padStart(2, "0")}:00`;
const formatSimDateTime = (hour: number) => `${formatSimShortDate(hour)} · ${formatSimTime(hour)}`;

const formatMonthName = (month: number) => monthName.format(new Date(Date.UTC(GAME_RULES.simulationYear, month, 1)));

const pluralize = (count: number, unit: string) => `${count} ${unit}${count === 1 ? "" : "s"}`;

const formatDuration = (hours: number) => {
    const hoursPerWeek = HOURS_PER_DAY * DAYS_PER_WEEK;
    if (hours % hoursPerWeek === 0) return pluralize(hours / hoursPerWeek, "week");
    if (hours % HOURS_PER_DAY === 0) return pluralize(hours / HOURS_PER_DAY, "day");
    return pluralize(hours, "hour");
};

const dayKeyOf = (hour: number) => Math.floor(hour / HOURS_PER_DAY);

export {
    formatSimDate,
    formatSimShortDate,
    formatSimWeekdayDate,
    formatSimLongDay,
    formatSimTime,
    formatSimDateTime,
    formatMonthName,
    formatDuration,
    dayKeyOf,
};
