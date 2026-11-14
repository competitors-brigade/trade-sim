import { HOURS_PER_DAY, DAYS_PER_WEEK, hoursUntilSameDayNextMonth } from "@/util/time/calendar";
import type { TimePreset } from "@/types/game";

const TIME_PRESETS: readonly TimePreset[] = [
    { id: "hour", label: "1h", title: "1 hour", resolve: () => 1 },
    { id: "day", label: "1d", title: "1 day", resolve: () => HOURS_PER_DAY },
    { id: "week", label: "1w", title: "1 week", resolve: () => HOURS_PER_DAY * DAYS_PER_WEEK },
    { id: "fortnight", label: "2w", title: "2 weeks", resolve: () => HOURS_PER_DAY * DAYS_PER_WEEK * 2 },
    { id: "month", label: "1mo", title: "1 month (same date next month)", resolve: hoursUntilSameDayNextMonth },
];

export { TIME_PRESETS };
