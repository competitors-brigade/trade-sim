import type { AuthUser } from "@/types/auth";
import type { AuthProvider } from "./AuthProvider";

const IDENTITY_KEY = "brigade-trading.guest.identity";
const ACTIVE_KEY = "brigade-trading.guest.active";
const MAX_NAME_LENGTH = 32;

const readIdentity = (): AuthUser | null => {
    try {
        const parsed = JSON.parse(localStorage.getItem(IDENTITY_KEY) ?? "null") as AuthUser | null;
        return parsed && typeof parsed.id === "string" && typeof parsed.displayName === "string" ? parsed : null;
    } catch {
        return null;
    }
};

const writeIdentity = (user: AuthUser) => localStorage.setItem(IDENTITY_KEY, JSON.stringify(user));

const cleanName = (name: string) => name.trim().slice(0, MAX_NAME_LENGTH);

const unsupported = async (): Promise<never> => {
    throw new Error("Accounts are not enabled. Configure Supabase to use email sign-in.");
};

const createGuestAuth = (): AuthProvider => ({
    source: "guest",

    getSession: async () => (localStorage.getItem(ACTIVE_KEY) === "true" ? readIdentity() : null),

    signIn: unsupported,
    signUp: unsupported,
    signInWithGoogle: unsupported,

    signInAsGuest: async (displayName) => {
        const name = cleanName(displayName);
        if (!name) throw new Error("Enter a name to continue.");
        const user: AuthUser = { id: readIdentity()?.id ?? crypto.randomUUID(), email: null, displayName: name };
        writeIdentity(user);
        localStorage.setItem(ACTIVE_KEY, "true");
        return user;
    },

    signOut: async () => {
        localStorage.removeItem(ACTIVE_KEY);
    },

    updateDisplayName: async (displayName) => {
        const identity = readIdentity();
        const name = cleanName(displayName);
        if (!identity) throw new Error("You are not signed in.");
        if (!name) throw new Error("Enter a name.");
        const user = { ...identity, displayName: name };
        writeIdentity(user);
        return user;
    },
});

export default createGuestAuth;
