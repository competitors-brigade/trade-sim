import type { ReactNode } from "react";
import styles from "./StatTile.module.css";

interface StatTileProps {
    label: string;
    value: ReactNode;
    detail?: ReactNode;
}

const StatTile = ({ label, value, detail }: StatTileProps) => (
    <div className={styles.tile}>
        <span className={styles.label}>{label}</span>
        <span className={`num ${styles.value}`}>{value}</span>
        {detail && <span className={styles.detail}>{detail}</span>}
    </div>
);

export default StatTile;
export type { StatTileProps };
