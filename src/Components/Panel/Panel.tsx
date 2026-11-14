import type { ReactNode } from "react";
import { cx } from "@/util/ui/classNames";
import styles from "./Panel.module.css";

interface PanelProps {
    title?: string;
    actions?: ReactNode;
    flush?: boolean;
    className?: string;
    children: ReactNode;
}

const Panel = ({ title, actions, flush = false, className, children }: PanelProps) => (
    <section className={cx(styles.panel, className)}>
        {(title || actions) && (
            <header className={styles.header}>
                {title && <h2 className={styles.title}>{title}</h2>}
                {actions && <div className={styles.actions}>{actions}</div>}
            </header>
        )}
        <div className={cx(styles.body, flush && styles.flush)}>{children}</div>
    </section>
);

export default Panel;
export type { PanelProps };
