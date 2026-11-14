import { useEffect, useRef } from "react";
import { Navigate, useLocation, useOutlet } from "react-router";
import { useAppSelector } from "@/Hooks/redux";
import Sidebar from "./Sidebar/Sidebar";
import SimulationBar from "./SimulationBar/SimulationBar";
import styles from "./AppLayout.module.css";

const AppLayout = () => {
    const outlet = useOutlet();
    const { pathname } = useLocation();
    const { status, user, loadedSaveFor } = useAppSelector((state) => state.auth);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 });
    }, [pathname]);

    if (status === "loading") return null;
    if (!user) return <Navigate to="/login" replace />;
    if (loadedSaveFor !== user.id) return null;

    return (
        <div className={styles.app}>
            <Sidebar />
            <div className={styles.column}>
                <SimulationBar />
                <div ref={scrollRef} className={styles.scroll}>
                    <main className={styles.main}>{outlet}</main>
                </div>
            </div>
        </div>
    );
};

export default AppLayout;
