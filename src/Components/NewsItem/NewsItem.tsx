import { Link } from "react-router";
import { SECTOR_LABELS } from "@/data/sectors";
import { cx } from "@/util/ui/classNames";
import { formatSimDateTime, formatSimTime } from "@/util/time/format";
import type { NewsArticle } from "@/types/market";
import styles from "./NewsItem.module.css";

interface NewsItemProps {
    article: NewsArticle;
    showDate?: boolean;
    compact?: boolean;
}

const NewsItem = ({ article, showDate = true, compact = false }: NewsItemProps) => {
    const { symbol, sector, scope, hour, headline, summary } = article;

    return (
        <article className={cx(styles.item, compact && styles.compact)}>
            <div className={styles.meta}>
                <span className={styles.time}>{showDate ? formatSimDateTime(hour) : formatSimTime(hour)}</span>
                {scope === "company" && symbol ? (
                    <Link to={`/market/${symbol}`} className={styles.symbol}>
                        {symbol}
                    </Link>
                ) : (
                    <span className={styles.scope}>{scope === "sector" && sector ? SECTOR_LABELS[sector] : "Market-wide"}</span>
                )}
            </div>
            <h3 className={styles.headline}>{headline}</h3>
            {!compact && <p className={styles.summary}>{summary}</p>}
        </article>
    );
};

export default NewsItem;
export type { NewsItemProps };
