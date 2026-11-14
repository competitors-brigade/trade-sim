const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const round2 = (value: number) => Math.round(value * 100) / 100;

const niceStep = (rough: number) => {
    const exponent = Math.floor(Math.log10(rough));
    const fraction = rough / 10 ** exponent;
    const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
    return nice * 10 ** exponent;
};

const niceTicks = (min: number, max: number, count: number) => {
    if (!(max > min)) return [min];
    const step = niceStep((max - min) / count);
    const ticks: number[] = [];
    for (let value = Math.ceil(min / step) * step; value <= max + step * 1e-9; value += step) {
        ticks.push(value);
    }
    return ticks;
};

export { clamp, round2, niceTicks };
