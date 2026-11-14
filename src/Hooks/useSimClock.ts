import { useMemo } from "react";
import { useAppSelector } from "@/Hooks/redux";
import { selectHour } from "@/Redux/selectors";
import { GAME_RULES } from "@/data/gameRules";

const useSimClock = () => {
    const hour = useAppSelector(selectHour);

    return useMemo(
        () => ({
            hour,
            remaining: GAME_RULES.hoursPerYear - hour,
            progress: hour / GAME_RULES.hoursPerYear,
            finished: hour >= GAME_RULES.hoursPerYear,
        }),
        [hour],
    );
};

export default useSimClock;
