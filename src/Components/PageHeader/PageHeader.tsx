import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
}

const PageHeader = ({ title, description, actions }: PageHeaderProps) => (
    <header className={styles.header}>
        <div>
            <h1 className={styles.title}>{title}</h1>
            {description && <p className={styles.description}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
    </header>
);

export default PageHeader;
export type { PageHeaderProps };
