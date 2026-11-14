import { GAME_RULES } from "@/data/gameRules";

const MS_PER_HOUR = 3_600_000;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const YEAR_START_MS = Date.UTC(GAME_RULES.simulationYear, 0, 1);

const hourToDate = (hour: number) => new Date(YEAR_START_MS + hour * MS_PER_HOUR);

const dateToHour = (month: number, day: number, hourOfDay = 0) =>
    (Date.UTC(GAME_RULES.simulationYear, month, day, hourOfDay) - YEAR_START_MS) / MS_PER_HOUR;

const daysInMonth = (month: number) => new Date(Date.UTC(GAME_RULES.simulationYear, month + 1, 0)).getUTCDate();

const firstWeekdayOfMonth = (month: number) => new Date(Date.UTC(GAME_RULES.simulationYear, month, 1)).getUTCDay();

const monthOfHour = (hour: number) => hourToDate(Math.min(hour, GAME_RULES.hoursPerYear - 1)).getUTCMonth();

const hoursUntilSameDayNextMonth = (hour: number) => {
    const current = hourToDate(hour);
    const nextMonth = current.getUTCMonth() + 1;
    const day = Math.min(current.getUTCDate(), daysInMonth(nextMonth));
    return dateToHour(nextMonth, day, current.getUTCHours()) - hour;
};

const dayIndexOf = (month: number, day: number) => Math.floor(dateToHour(month, day) / HOURS_PER_DAY);

export {
    HOURS_PER_DAY,
    DAYS_PER_WEEK,
    hourToDate,
    dateToHour,
    daysInMonth,
    firstWeekdayOfMonth,
    monthOfHour,
    hoursUntilSameDayNextMonth,
    dayIndexOf,
};
