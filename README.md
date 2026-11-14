# Competitors Brigade Trading Challenge

A paper-trading game. Every player trades the same simulated year (8,760 hours) of 20 stocks, reads the news to decide what to buy and sell, and is ranked by return on the leaderboard.

## Run it

```bash
npm install
cp .env.example .env
npm run db:mock      # terminal 1: fake Supabase with seeded accounts
npm run dev          # terminal 2
```

The mock server prints a seeded login (all seeded accounts use `password123`). Without `VITE_SUPABASE_URL` the app falls back to guest play with a browser-only leaderboard.

For real Supabase, run `supabase/schema.sql` in the SQL editor and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Rules

Rules live in `src/data/gameRules.ts`: starting cash, 150% growth cap, 100% loss limit (both across the whole account for the year), 6-week competition length. Set `VITE_COMPETITION_START` (YYYY-MM-DD) to enforce the 6-week window; scores are only recorded while it is open.

## Adding content (all under `src/data`)

| To change | Edit |
| --- | --- |
| Add or tune a stock | `stocks.ts` (the sector must exist in `sectors.ts`) |
| Add a sector | `sectors.ts`, then `news/sectorNews.ts` and `news/sectorDrivers.ts` (TypeScript will flag the missing entries) |
| Add company headlines | `news/companyTopics.ts` (`{name}`, `{pct}`, `{amount}`, `{quarter}` slots) |
| Add sector or market headlines | `news/sectorDrivers.ts`, `news/frames.ts`, `news/marketNews.ts` |
| News frequency, price impact, volatility | `marketModel.ts` (`news.articlesPerWindow` / `windowHours`) |
| Time-advance buttons | `timePresets.ts` |
| Chart ranges, nav items, themes | `chartRanges.ts`, `navigation.ts`, `themes.ts` |

The market is generated from `VITE_MARKET_SEED`, so every player sees identical prices and news. Change the seed for a new season.
