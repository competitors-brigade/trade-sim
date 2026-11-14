import { GAME_RULES } from "@/data/gameRules";
import { timeAdvanced } from "@/Redux/actions";
import { submitScore } from "@/Redux/Slices/leaderboardSlice";
import { round2 } from "@/util/math/numbers";
import { HOURS_PER_DAY } from "@/util/time/calendar";
import { computeEquity } from "@/util/portfolio/valuation";
import type { AppThunk } from "@/Redux/store";

const advanceTime =
    (requestedHours: number): AppThunk =>
    (dispatch, getState) => {
        const { simulation, portfolio } = getState();
        const hours = Math.min(Math.floor(requestedHours), GAME_RULES.hoursPerYear - simulation.hour);
        if (!(hours > 0)) return;

        const target = simulation.hour + hours;
        const firstDay = Math.floor(simulation.hour / HOURS_PER_DAY) + 1;
        const lastDay = Math.floor(target / HOURS_PER_DAY);

        const dailyEquity: number[] = [];
        for (let day = firstDay; day <= lastDay; day++) {
            dailyEquity.push(round2(computeEquity(portfolio.cash, portfolio.positions, day * HOURS_PER_DAY)));
        }

        dispatch(timeAdvanced({ hour: target, dailyEquity }));
        void dispatch(submitScore());
    };

export default advanceTime;
