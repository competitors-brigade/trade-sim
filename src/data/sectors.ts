const SECTORS = [
    { id: "technology", label: "Technology" },
    { id: "energy", label: "Energy" },
    { id: "healthcare", label: "Healthcare" },
    { id: "financials", label: "Financials" },
    { id: "consumer", label: "Consumer" },
    { id: "industrials", label: "Industrials" },
] as const;

type SectorId = (typeof SECTORS)[number]["id"];

const SECTOR_LABELS = Object.fromEntries(SECTORS.map((sector) => [sector.id, sector.label])) as Record<SectorId, string>;

export { SECTORS, SECTOR_LABELS };
export type { SectorId };
