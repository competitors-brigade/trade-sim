import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { AuthUser } from "@/types/auth";
import type { AuthProvider } from "./AuthProvider";

const DEFAULT_NAME = "Player";

const toAuthUser = (user: User): AuthUser => {
    const metadataName = user.user_metadata?.display_name;
    return {
        id: user.id,
        email: user.email ?? null,
        displayName: (typeof metadataName === "string" && metadataName) || user.email?.split("@")[0] || DEFAULT_NAME,
    };
};

const createSupabaseAuth = (client: SupabaseClient): AuthProvider => ({
    source: "supabase",

    getSession: async () => {
        const { data, error } = await client.auth.getSession();
        if (error) throw new Error(error.message);
        return data.session ? toAuthUser(data.session.user) : null;
    },

    signIn: async (email, password) => {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        return toAuthUser(data.user);
    },

    signUp: async (email, password, displayName) => {
        const { data, error } = await client.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
        if (error) throw new Error(error.message);
        if (data.session && data.user) return { user: toAuthUser(data.user), confirmationRequired: false };
        return { user: null, confirmationRequired: true };
    },

    signInAsGuest: async () => {
        throw new Error("Guest play is not available when accounts are enabled.");
    },

    signOut: async () => {
        const { error } = await client.auth.signOut();
        if (error) throw new Error(error.message);
    },

    updateDisplayName: async (displayName) => {
        const { data, error } = await client.auth.updateUser({ data: { display_name: displayName } });
        if (error) throw new Error(error.message);
        return toAuthUser(data.user);
    },
});

export default createSupabaseAuth;
