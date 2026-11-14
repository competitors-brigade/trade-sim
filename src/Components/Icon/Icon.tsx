import type { ReactNode } from "react";

const ICONS = {
    dashboard: (
        <>
            <rect x="3" y="3" width="7" height="8" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="15" width="7" height="6" rx="1" />
        </>
    ),
    market: <path d="M3 17l6-6 4 4 8-9M15 6h6v6" />,
    chart: (
        <>
            <path d="M3 3v18h18" />
            <path d="M7 15l4-5 3 3 5-7" />
        </>
    ),
    news: (
        <>
            <rect x="4" y="4" width="16" height="16" rx="1.5" />
            <path d="M8 9h8M8 13h8M8 17h5" />
        </>
    ),
    portfolio: (
        <>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18" />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
        </>
    ),
    leaderboard: (
        <>
            <rect x="3" y="12" width="5" height="9" />
            <rect x="9.5" y="4" width="5" height="17" />
            <rect x="16" y="9" width="5" height="12" />
        </>
    ),
    settings: (
        <>
            <path d="M4 7h8M18 7h2M4 17h2M12 17h8" />
            <circle cx="15" cy="7" r="2.2" />
            <circle cx="9" cy="17" r="2.2" />
        </>
    ),
} satisfies Record<string, ReactNode>;

type IconName = keyof typeof ICONS;

interface IconProps {
    name: IconName;
    size?: number;
}

const Icon = ({ name, size = 18 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {ICONS[name]}
    </svg>
);

export default Icon;
export type { IconName, IconProps };
