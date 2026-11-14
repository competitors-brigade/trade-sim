create table if not exists public.leaderboard (
    player_id  uuid primary key references auth.users (id) on delete cascade,
    name       text not null check (char_length(name) between 1 and 32),
    return_pct double precision not null check (return_pct between -1 and 1.5),
    equity     double precision not null check (equity between 0 and 250000),
    hour       integer not null check (hour between 0 and 8760),
    updated_at timestamptz not null default now()
);

create index if not exists leaderboard_return_idx on public.leaderboard (return_pct desc);

alter table public.leaderboard enable row level security;

create policy "leaderboard is publicly readable"
    on public.leaderboard for select
    using (true);

create policy "players can insert their own row"
    on public.leaderboard for insert
    to authenticated
    with check (auth.uid() = player_id);

create policy "players can update their own row"
    on public.leaderboard for update
    to authenticated
    using (auth.uid() = player_id)
    with check (auth.uid() = player_id);

-- The check constraints mirror src/data/gameRules.ts (maxLoss, maxGrowth, startingCash, hoursPerYear).
-- Scores are still computed in the browser, so a determined player can post a made-up number within these
-- bounds. Closing that gap needs server-side verification (an edge function replaying the trade log).
