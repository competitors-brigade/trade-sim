/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL?: string;
    readonly VITE_SUPABASE_ANON_KEY?: string;
    readonly VITE_MARKET_SEED?: string;
    readonly VITE_COMPETITION_START?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
