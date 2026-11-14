import { NavLink } from "react-router";
import Icon from "@/Components/Icon/Icon";
import { cx } from "@/util/ui/classNames";
import type { NavItem } from "@/data/navigation";
import styles from "./Sidebar.module.css";

interface SidebarLinkProps {
    item: NavItem;
}

const SidebarLink = ({ item }: SidebarLinkProps) => (
    <NavLink to={item.path} end={item.end} className={({ isActive }) => cx(styles.link, isActive && styles.active)}>
        <Icon name={item.icon} />
        <span>{item.label}</span>
    </NavLink>
);

export default SidebarLink;
