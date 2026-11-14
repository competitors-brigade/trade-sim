import { useMemo, useState } from "react";
import PageHeader from "@/Components/PageHeader/PageHeader";
import SegmentedControl from "@/Components/SegmentedControl/SegmentedControl";
import { CHART_RANGES, DEFAULT_CHART_RANGE } from "@/data/chartRanges";
import { SECTORS, type SectorId } from "@/data/sectors";
import { useStockList } from "@/Hooks/useMarket";
import useSimClock from "@/Hooks/useSimClock";
import { getPriceSeries } from "@/services/market/Market";
import ChartCard from "./ChartCard";
import styles from "./Charts.module.css";

type SectorFilter = SectorId | "all";

const CHART_POINTS = 120;

const rangeOptions = CHART_RANGES.map(({ value, label }) => ({ value, label }));
const sectorOptions: ReadonlyArray<{ value: SectorFilter; label: string }> = [
    { value: "all", label: "All" },
    ...SECTORS.map(({ id, label }) => ({ value: id, label })),
];

const Charts = () => {
    const stocks = useStockList();
    const { hour } = useSimClock();
    const [rangeValue, setRangeValue] = useState(DEFAULT_CHART_RANGE);
    const [sector, setSector] = useState<SectorFilter>("all");

    const range = CHART_RANGES.find((candidate) => candidate.value === rangeValue) ?? CHART_RANGES[0];

    const cards = useMemo(
        () =>
            stocks
                .filter(({ definition }) => sector === "all" || definition.sector === sector)
                .map(({ definition, quote }) => ({
                    definition,
                    quote,
                    points: getPriceSeries(definition.symbol, Math.max(0, hour - range.hours), hour, CHART_POINTS).map((point) => ({
                        x: point.hour,
                        y: point.price,
                    })),
                })),
        [stocks, sector, hour, range.hours],
    );

    return (
        <>
            <PageHeader
                title="Charts"
                description="Price history for every listed company. Select a chart to open the full view and trade."
                actions={<SegmentedControl label="Chart range" options={rangeOptions} value={rangeValue} onChange={setRangeValue} />}
            />

            <div className={styles.filters}>
                <SegmentedControl label="Sector" options={sectorOptions} value={sector} onChange={setSector} />
            </div>

            <div className={styles.grid}>
                {cards.map(({ definition, quote, points }) => (
                    <ChartCard key={definition.symbol} definition={definition} quote={quote} points={points} />
                ))}
            </div>
        </>
    );
};

export default Charts;
