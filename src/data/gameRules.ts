const GAME_RULES = {
    hoursPerYear: 8760,
    simulationYear: 2027,
    startingCash: 100_000,
    maxGrowth: 1.5,
    maxLoss: 1,
    competitionWeeks: 6,
    minPrice: 0.5,
    leaderboardSize: 100,
} as const;

export { GAME_RULES };
