import { NAV_ITEMS } from "@/data/navigation";
import SidebarLink from "./SidebarLink";
import CompetitionStatus from "./CompetitionStatus";
import AccountMenu from "./AccountMenu";
import styles from "./Sidebar.module.css";

const Sidebar = () => (
    <aside className={styles.sidebar}>
        <div className={styles.brand}>
            <span className={styles.mark} aria-hidden="true" />
            <div>
                <p className={styles.name}>Competitors Brigade</p>
                <p className={styles.tagline}>Trading Challenge</p>
            </div>
        </div>

        <nav className={styles.nav} aria-label="Primary">
            {NAV_ITEMS.map((item) => (
                <SidebarLink key={item.path} item={item} />
            ))}
        </nav>

        <div className={styles.footer}>
            <CompetitionStatus />
            <AccountMenu />
        </div>
    </aside>
);

export default Sidebar;
