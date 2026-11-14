import { useState, type FormEvent } from "react";
import { Navigate } from "react-router";
import SegmentedControl from "@/Components/SegmentedControl/SegmentedControl";
import { useAppDispatch, useAppSelector } from "@/Hooks/redux";
import { signIn, signInAsGuest, signUp } from "@/Redux/Slices/authSlice";
import authService from "@/services/auth/AuthService";
import styles from "./Login.module.css";

type Mode = "signIn" | "signUp";

const MODE_OPTIONS: ReadonlyArray<{ value: Mode; label: string }> = [
    { value: "signIn", label: "Sign in" },
    { value: "signUp", label: "Create account" },
];

const MIN_PASSWORD_LENGTH = 6;

const Login = () => {
    const dispatch = useAppDispatch();
    const { status, busy, error } = useAppSelector((state) => state.auth);
    const [mode, setMode] = useState<Mode>("signIn");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [notice, setNotice] = useState<string | null>(null);

    const guestMode = authService.source === "guest";

    if (status === "loading") return null;
    if (status === "signedIn") return <Navigate to="/" replace />;

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setNotice(null);

        if (guestMode) {
            void dispatch(signInAsGuest(displayName));
        } else if (mode === "signIn") {
            void dispatch(signIn({ email: email.trim(), password }));
        } else {
            const result = await dispatch(signUp({ email: email.trim(), password, displayName: displayName.trim() }));
            if (signUp.fulfilled.match(result) && result.payload.confirmationRequired) {
                setNotice("Check your inbox for a confirmation link, then sign in.");
                setMode("signIn");
            }
        }
    };

    const showName = guestMode || mode === "signUp";

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.brand}>
                    <span className={styles.mark} aria-hidden="true" />
                    <div>
                        <p className={styles.name}>Competitors Brigade</p>
                        <p className={styles.tagline}>Trading Challenge</p>
                    </div>
                </div>

                <h1 className={styles.title}>{guestMode ? "Choose a trader name" : mode === "signIn" ? "Welcome back" : "Join the challenge"}</h1>
                <p className={styles.lead}>
                    {guestMode
                        ? "Accounts aren't enabled on this server, so your progress is saved in this browser only."
                        : "Trade a simulated year, climb the leaderboard, and keep your progress across devices."}
                </p>

                {!guestMode && <SegmentedControl label="Account mode" options={MODE_OPTIONS} value={mode} onChange={setMode} />}

                <form className={styles.form} onSubmit={submit}>
                    {showName && (
                        <label className={styles.field}>
                            <span className={styles.label}>{guestMode ? "Trader name" : "Display name"}</span>
                            <input className="field" value={displayName} maxLength={32} autoComplete="nickname" required onChange={(event) => setDisplayName(event.target.value)} />
                        </label>
                    )}

                    {!guestMode && (
                        <>
                            <label className={styles.field}>
                                <span className={styles.label}>Email</span>
                                <input className="field" type="email" value={email} autoComplete="email" required onChange={(event) => setEmail(event.target.value)} />
                            </label>
                            <label className={styles.field}>
                                <span className={styles.label}>Password</span>
                                <input
                                    className="field"
                                    type="password"
                                    value={password}
                                    minLength={MIN_PASSWORD_LENGTH}
                                    autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                                    required
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </label>
                        </>
                    )}

                    {error && (
                        <p className={styles.error} role="alert">
                            {error}
                        </p>
                    )}
                    {notice && (
                        <p className={styles.notice} role="status">
                            {notice}
                        </p>
                    )}

                    <button type="submit" className="button primary" disabled={busy}>
                        {busy ? "Please wait…" : guestMode ? "Start trading" : mode === "signIn" ? "Sign in" : "Create account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
