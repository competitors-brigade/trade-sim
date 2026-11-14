import supabase from "@/services/supabase/client";
import createGuestAuth from "./GuestAuth";
import createSupabaseAuth from "./SupabaseAuth";

const authService = supabase ? createSupabaseAuth(supabase) : createGuestAuth();

export default authService;
