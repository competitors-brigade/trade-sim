interface Rng {
    next: () => number;
    int: (min: number, max: number) => number;
    chance: (probability: number) => boolean;
    normal: () => number;
    poisson: (mean: number) => number;
    deck: <T>(items: readonly T[]) => () => T;
}

const hashSeed = (seed: string) => {
    let hash = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
        hash = Math.imul(hash ^ seed.charCodeAt(i), 3432918353);
        hash = (hash << 13) | (hash >>> 19);
    }
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^ (hash >>> 16)) >>> 0;
};

const mulberry32 = (seed: number) => {
    let state = seed;
    return () => {
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

const createRng = (seed: string): Rng => {
    const next = mulberry32(hashSeed(seed));
    let spare: number | null = null;

    const normal = () => {
        if (spare !== null) {
            const value = spare;
            spare = null;
            return value;
        }
        const u = 1 - next();
        const v = next();
        const radius = Math.sqrt(-2 * Math.log(u));
        spare = radius * Math.sin(2 * Math.PI * v);
        return radius * Math.cos(2 * Math.PI * v);
    };

    const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));

    const poisson = (mean: number) => {
        const limit = Math.exp(-mean);
        let count = 0;
        let product = 1;
        do {
            count++;
            product *= next();
        } while (product > limit);
        return count - 1;
    };

    const shuffle = <T>(items: T[]) => {
        for (let i = items.length - 1; i > 0; i--) {
            const j = int(0, i);
            [items[i], items[j]] = [items[j], items[i]];
        }
        return items;
    };

    const deck = <T>(items: readonly T[]) => {
        let remaining: T[] = [];
        return () => {
            if (remaining.length === 0) remaining = shuffle([...items]);
            return remaining.pop() as T;
        };
    };

    return { next, int, chance: (probability) => next() < probability, normal, poisson, deck };
};

export { createRng };
export type { Rng };
