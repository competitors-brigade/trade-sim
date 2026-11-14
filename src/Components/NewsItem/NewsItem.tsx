import { Link } from "react-router";
import { SECTOR_LABELS } from "@/data/sectors";
import { cx } from "@/util/ui/classNames";
import { formatSimDateTime, formatSimTime } from "@/util/time/format";
import type { ImpactLevel, NewsArticle } from "@/types/market";
import styles from "./NewsItem.module.css";

interface NewsItemProps {
    article: NewsArticle;
    showDate?: boolean;
    compact?: boolean;
}

const IMPACT_LEVELS: Record<ImpactLevel, { label: string; filled: number }> = {
    low: { label: "Low impact", filled: 1 },
    medium: { label: "Medium impact", filled: 2 },
    high: { label: "High impact", filled: 3 },
};

const NewsItem = ({ article, showDate = true, compact = false }: NewsItemProps) => {
    const { symbol, sector, scope, sentiment, impact, hour, headline, summary } = article;
    const impactLevel = IMPACT_LEVELS[impact];

    return (
        <article className={cx(styles.item, compact && styles.compact)}>
            <div className={styles.meta}>
                <span className={cx(styles.sentiment, sentiment === "positive" ? styles.positive : styles.negative)}>
                    {sentiment === "positive" ? "Positive" : "Negative"}
                </span>
                <span className={styles.time}>{showDate ? formatSimDateTime(hour) : formatSimTime(hour)}</span>
                {scope === "company" && symbol ? (
                    <Link to={`/market/${symbol}`} className={styles.symbol}>
                        {symbol}
                    </Link>
                ) : (
                    <span className={styles.scope}>{scope === "sector" && sector ? SECTOR_LABELS[sector] : "Market-wide"}</span>
                )}
                <span className={styles.impact} title={impactLevel.label}>
                    {[1, 2, 3].map((step) => (
                        <span key={step} className={cx(styles.pip, step <= impactLevel.filled && styles.pipFilled)} />
                    ))}
                    <span className="visually-hidden">{impactLevel.label}</span>
                </span>
            </div>
            <h3 className={styles.headline}>{headline}</h3>
            {!compact && <p className={styles.summary}>{summary}</p>}
        </article>
    );
};

export default NewsItem;
export type { NewsItemProps };
