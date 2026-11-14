import type { IconName } from "@/Components/Icon/Icon";

interface NavItem {
    path: string;
    label: string;
    icon: IconName;
    end?: boolean;
}

const NAV_ITEMS: readonly NavItem[] = [
    { path: "/", label: "Dashboard", icon: "dashboard", end: true },
    { path: "/market", label: "Market", icon: "market" },
    { path: "/charts", label: "Charts", icon: "chart" },
    { path: "/news", label: "News", icon: "news" },
    { path: "/portfolio", label: "Portfolio", icon: "portfolio" },
    { path: "/calendar", label: "Calendar", icon: "calendar" },
    { path: "/leaderboard", label: "Leaderboard", icon: "leaderboard" },
    { path: "/settings", label: "Settings", icon: "settings" },
];

export { NAV_ITEMS };
export type { NavItem };
