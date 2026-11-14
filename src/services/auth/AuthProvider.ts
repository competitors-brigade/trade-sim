import type { AuthUser, SignUpResult } from "@/types/auth";

type AuthSource = "supabase" | "guest";

interface AuthProvider {
    source: AuthSource;
    getSession: () => Promise<AuthUser | null>;
    signIn: (email: string, password: string) => Promise<AuthUser>;
    signUp: (email: string, password: string, displayName: string) => Promise<SignUpResult>;
    signInWithGoogle: () => Promise<void>;
    signInAsGuest: (displayName: string) => Promise<AuthUser>;
    signOut: () => Promise<void>;
    updateDisplayName: (displayName: string) => Promise<AuthUser>;
}

export type { AuthProvider, AuthSource };
