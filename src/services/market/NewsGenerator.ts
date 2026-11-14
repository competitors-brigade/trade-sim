import { GAME_RULES } from "@/data/gameRules";
import { MARKET_MODEL } from "@/data/marketModel";
import { SECTORS, SECTOR_LABELS } from "@/data/sectors";
import { STOCKS } from "@/data/stocks";
import { COMPANY_TOPICS } from "@/data/news/companyTopics";
import { MARKET_DRIVERS, MARKET_FRAMES, MARKET_SUMMARIES, NEWS_SLOTS, SECTOR_FRAMES, SECTOR_SUMMARIES } from "@/data/news/frames";
import { MARKET_NEWS } from "@/data/news/marketNews";
import { SECTOR_DRIVERS } from "@/data/news/sectorDrivers";
import { SECTOR_NEWS } from "@/data/news/sectorNews";
import { hourToDate } from "@/util/time/calendar";
import { createRng } from "./random";
import type { Rng } from "./random";
import type { ImpactLevel, MarketEvent, NewsScope, NewsTemplate, Sentiment, StockDefinition } from "@/types/market";

type EventDraft = Omit<MarketEvent, "id">;
type TemplateDecks = Record<Sentiment, () => NewsTemplate>;

const SENTIMENTS: readonly Sentiment[] = ["positive", "negative"];

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const fill = (text: string, values: Record<string, string>) =>
    text.replace(/\{(\w+)\}/g, (match, key: string) => {
        if (key in values) return values[key];
        const lower = key.charAt(0).toLowerCase() + key.slice(1);
        return lower in values ? capitalize(values[lower]) : match;
    });

const expandFrames = (frames: readonly string[], drivers: readonly string[], summaries: readonly string[], values: Record<string, string>) =>
    frames.flatMap((frame, frameIndex) =>
        drivers.map((driver, driverIndex): NewsTemplate => ({
            headline: fill(frame, { ...values, driver }),
            summary: fill(summaries[(frameIndex + driverIndex) % summaries.length], values),
        })),
    );

const classify = (strength: number): ImpactLevel => {
    const { low, medium } = MARKET_MODEL.impactThresholds;
    if (strength < low) return "low";
    if (strength < medium) return "medium";
    return "high";
};

const pickScope = (rng: Rng): NewsScope => {
    const entries = Object.entries(MARKET_MODEL.news.mix) as Array<[NewsScope, number]>;
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = rng.next() * total;
    for (const [scope, weight] of entries) {
        roll -= weight;
        if (roll < 0) return scope;
    }
    return entries[entries.length - 1][0];
};

const rollEvent = (rng: Rng, scope: NewsScope, hour: number) => {
    const profile = MARKET_MODEL.scopes[scope];
    const strength = rng.next() ** MARKET_MODEL.strengthExponent;
    const magnitude = profile.magnitude.min + (profile.magnitude.max - profile.magnitude.min) * strength;
    const sentiment: Sentiment = rng.chance(0.5) ? "positive" : "negative";
    const realized: Sentiment = rng.chance(MARKET_MODEL.misreadRate) ? (sentiment === "positive" ? "negative" : "positive") : sentiment;

    return {
        scope,
        sentiment,
        hour,
        impact: classify(strength),
        logImpact: realized === "positive" ? magnitude : -magnitude,
        durationHours: rng.int(profile.duration.min, profile.duration.max),
    };
};

const generateEvents = (seed: string, stocks: readonly StockDefinition[] = STOCKS): MarketEvent[] => {
    const rng = createRng(`${seed}:news`);
    const { articlesPerWindow, windowHours } = MARKET_MODEL.news;

    const nextStock = rng.deck(stocks);
    const nextSector = rng.deck(SECTORS);
    const topicDecks = new Map(stocks.map((stock) => [stock.symbol, rng.deck(COMPANY_TOPICS)]));

    const sectorDecks = new Map(
        SECTORS.map((sector) => {
            const values = { sector: SECTOR_LABELS[sector.id].toLowerCase() };
            const decks = Object.fromEntries(
                SENTIMENTS.map((sentiment) => [
                    sentiment,
                    rng.deck([
                        ...SECTOR_NEWS[sector.id][sentiment],
                        ...expandFrames(SECTOR_FRAMES[sentiment], SECTOR_DRIVERS[sector.id][sentiment], SECTOR_SUMMARIES[sentiment], values),
                    ]),
                ]),
            ) as TemplateDecks;
            return [sector.id, decks];
        }),
    );

    const marketDecks = Object.fromEntries(
        SENTIMENTS.map((sentiment) => [
            sentiment,
            rng.deck([...MARKET_NEWS[sentiment], ...expandFrames(MARKET_FRAMES[sentiment], MARKET_DRIVERS[sentiment], MARKET_SUMMARIES[sentiment], {})]),
        ]),
    ) as TemplateDecks;

    const lastHour = GAME_RULES.hoursPerYear - MARKET_MODEL.eventBlackoutHours;
    const windows = Math.ceil(GAME_RULES.hoursPerYear / windowHours);
    const drafts: EventDraft[] = [];

    for (let window = 0; window < windows; window++) {
        const start = window * windowHours;
        const end = Math.min(start + windowHours - 1, lastHour);
        if (start > end) break;

        for (let slot = 0; slot < articlesPerWindow; slot++) {
            const hour = rng.int(start, end);
            const scope = pickScope(rng);
            const roll = rollEvent(rng, scope, hour);

            if (scope === "company") {
                const stock = nextStock();
                const template = topicDecks.get(stock.symbol)!()[roll.sentiment];
                const values = {
                    name: stock.name,
                    pct: String(rng.int(NEWS_SLOTS.percent.min, NEWS_SLOTS.percent.max)),
                    amount: NEWS_SLOTS.amounts[rng.int(0, NEWS_SLOTS.amounts.length - 1)],
                    quarter: `Q${Math.floor(hourToDate(hour).getUTCMonth() / 3) + 1}`,
                };
                drafts.push({
                    ...roll,
                    symbol: stock.symbol,
                    headline: fill(template.headline, values),
                    summary: fill(template.summary, values),
                });
            } else if (scope === "sector") {
                const sector = nextSector();
                const template = sectorDecks.get(sector.id)![roll.sentiment]();
                drafts.push({ ...roll, sector: sector.id, headline: template.headline, summary: template.summary });
            } else {
                const template = marketDecks[roll.sentiment]();
                drafts.push({ ...roll, headline: template.headline, summary: template.summary });
            }
        }
    }

    return drafts
        .sort((a, b) => a.hour - b.hour)
        .map((draft, index) => ({ ...draft, id: `news-${String(index + 1).padStart(4, "0")}` }));
};

export { generateEvents };
