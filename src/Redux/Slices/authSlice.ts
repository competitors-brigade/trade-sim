import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { saveLoaded, sessionChanged } from "@/Redux/actions";
import authService from "@/services/auth/AuthService";
import type { AuthState, SignUpResult } from "@/types/auth";

interface Credentials {
    email: string;
    password: string;
}

interface SignUpArgs extends Credentials {
    displayName: string;
}

const initialState: AuthState = {
    user: null,
    status: "loading",
    busy: false,
    error: null,
    loadedSaveFor: null,
};

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : "Something went wrong. Please try again.");

const restoreSession = createAsyncThunk<void, void>("auth/restore", async (_, { dispatch }) => {
    try {
        dispatch(sessionChanged(await authService.getSession()));
    } catch (error) {
        console.error("Could not restore session:", error);
        dispatch(sessionChanged(null));
    }
});

const signIn = createAsyncThunk<void, Credentials, { rejectValue: string }>("auth/signIn", async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
        dispatch(sessionChanged(await authService.signIn(email, password)));
    } catch (error) {
        return rejectWithValue(errorMessage(error));
    }
});

const signUp = createAsyncThunk<SignUpResult, SignUpArgs, { rejectValue: string }>(
    "auth/signUp",
    async ({ email, password, displayName }, { dispatch, rejectWithValue }) => {
        try {
            const result = await authService.signUp(email, password, displayName);
            if (result.user) dispatch(sessionChanged(result.user));
            return result;
        } catch (error) {
            return rejectWithValue(errorMessage(error));
        }
    },
);

const signInWithGoogle = createAsyncThunk<void, void, { rejectValue: string }>("auth/google", async (_, { rejectWithValue }) => {
    try {
        await authService.signInWithGoogle();
    } catch (error) {
        return rejectWithValue(errorMessage(error));
    }
});

const signInAsGuest = createAsyncThunk<void, string, { rejectValue: string }>("auth/guest", async (displayName, { dispatch, rejectWithValue }) => {
    try {
        dispatch(sessionChanged(await authService.signInAsGuest(displayName)));
    } catch (error) {
        return rejectWithValue(errorMessage(error));
    }
});

const signOut = createAsyncThunk<void, void>("auth/signOut", async (_, { dispatch }) => {
    try {
        await authService.signOut();
    } catch (error) {
        console.error("Sign out failed:", error);
    }
    dispatch(sessionChanged(null));
});

const updateDisplayName = createAsyncThunk<void, string, { rejectValue: string }>("auth/updateName", async (name, { dispatch, rejectWithValue }) => {
    try {
        dispatch(sessionChanged(await authService.updateDisplayName(name)));
    } catch (error) {
        return rejectWithValue(errorMessage(error));
    }
});

const pending = (state: AuthState) => {
    state.busy = true;
    state.error = null;
};

const rejected = (state: AuthState, action: { payload?: string }) => {
    state.busy = false;
    state.error = action.payload ?? "Something went wrong. Please try again.";
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sessionChanged, (state, action) => {
                state.user = action.payload;
                state.status = action.payload ? "signedIn" : "signedOut";
                if (!action.payload) state.loadedSaveFor = null;
            })
            .addCase(saveLoaded, (state, action) => {
                state.loadedSaveFor = action.payload.userId;
            });

        for (const thunk of [signIn, signUp, signInWithGoogle, signInAsGuest, updateDisplayName]) {
            builder
                .addCase(thunk.pending, pending)
                .addCase(thunk.rejected, rejected)
                .addCase(thunk.fulfilled, (state) => {
                    state.busy = false;
                });
        }
    },
});

export default authSlice.reducer;
export { restoreSession, signIn, signUp, signInWithGoogle, signInAsGuest, signOut, updateDisplayName };
