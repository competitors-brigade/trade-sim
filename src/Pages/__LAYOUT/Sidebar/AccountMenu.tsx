import { useAppDispatch, useAppSelector } from "@/Hooks/redux";
import { signOut } from "@/Redux/Slices/authSlice";
import styles from "./Sidebar.module.css";

const AccountMenu = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    if (!user) return null;

    return (
        <div className={styles.account}>
            <div className={styles.accountText}>
                <p className={styles.accountName}>{user.displayName}</p>
                {user.email && <p className={styles.accountEmail}>{user.email}</p>}
            </div>
            <button type="button" className={styles.signOut} onClick={() => void dispatch(signOut())}>
                Sign out
            </button>
        </div>
    );
};

export default AccountMenu;
