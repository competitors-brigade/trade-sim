interface AuthUser {
    id: string;
    email: string | null;
    displayName: string;
}

type AuthStatus = "loading" | "signedOut" | "signedIn";

interface AuthState {
    user: AuthUser | null;
    status: AuthStatus;
    busy: boolean;
    error: string | null;
    loadedSaveFor: string | null;
}

interface SignUpResult {
    user: AuthUser | null;
    confirmationRequired: boolean;
}

export type { AuthUser, AuthStatus, AuthState, SignUpResult };
