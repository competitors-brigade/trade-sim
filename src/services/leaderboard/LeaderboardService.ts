import supabase from "@/services/supabase/client";
import createLocalLeaderboard from "./LocalLeaderboard";
import createSupabaseLeaderboard from "./SupabaseLeaderboard";

const leaderboardService = supabase ? createSupabaseLeaderboard(supabase) : createLocalLeaderboard();

export default leaderboardService;
