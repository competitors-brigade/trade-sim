import { useMemo, useState } from "react";
import EmptyState from "@/Components/EmptyState/EmptyState";
import NewsItem from "@/Components/NewsItem/NewsItem";
import PageHeader from "@/Components/PageHeader/PageHeader";
import Panel from "@/Components/Panel/Panel";
import SegmentedControl from "@/Components/SegmentedControl/SegmentedControl";
import { useAppSelector } from "@/Hooks/redux";
import { usePositions } from "@/Hooks/usePortfolio";
import { selectNews } from "@/Redux/selectors";
import { dayKeyOf, formatSimLongDay } from "@/util/time/format";
import type { NewsArticle } from "@/types/market";
import styles from "./News.module.css";

type NewsFilter = "all" | "holdings" | "company" | "sector" | "market";

const PAGE_SIZE = 40;

const FILTER_OPTIONS: ReadonlyArray<{ value: NewsFilter; label: string }> = [
    { value: "all", label: "All" },
    { value: "holdings", label: "My holdings" },
    { value: "company", label: "Company" },
    { value: "sector", label: "Sector" },
    { value: "market", label: "Market-wide" },
];

interface DayGroup {
    key: number;
    hour: number;
    articles: NewsArticle[];
}

const News = () => {
    const news = useAppSelector(selectNews);
    const positions = usePositions();
    const [filter, setFilter] = useState<NewsFilter>("all");
    const [visible, setVisible] = useState(PAGE_SIZE);

    const filtered = useMemo(() => {
        switch (filter) {
            case "all":
                return news;
            case "holdings":
                return news.filter((article) => article.symbol !== undefined && positions[article.symbol] !== undefined);
            default:
                return news.filter((article) => article.scope === filter);
        }
    }, [news, filter, positions]);

    const groups = useMemo(() => {
        const result: DayGroup[] = [];
        for (const article of filtered.slice(0, visible)) {
            const key = dayKeyOf(article.hour);
            const last = result[result.length - 1];
            if (last?.key === key) last.articles.push(article);
            else result.push({ key, hour: article.hour, articles: [article] });
        }
        return result;
    }, [filtered, visible]);

    const changeFilter = (next: NewsFilter) => {
        setFilter(next);
        setVisible(PAGE_SIZE);
    };

    return (
        <>
            <PageHeader
                title="News"
                description="Not every headline moves a stock. Decide which stories are real and which are noise."
                actions={<SegmentedControl label="News filter" options={FILTER_OPTIONS} value={filter} onChange={changeFilter} />}
            />

            {filtered.length === 0 ? (
                <Panel>
                    <EmptyState
                        title={news.length === 0 ? "No news yet" : "Nothing matches this filter"}
                        description={news.length === 0 ? "Advance the simulation and headlines will start to appear." : "Try a different filter, or advance time for more headlines."}
                    />
                </Panel>
            ) : (
                <div className={styles.feed}>
                    {groups.map((group) => (
                        <section key={group.key}>
                            <h2 className={styles.dayHeading}>{formatSimLongDay(group.hour)}</h2>
                            <Panel>
                                {group.articles.map((article) => (
                                    <NewsItem key={article.id} article={article} showDate={false} />
                                ))}
                            </Panel>
                        </section>
                    ))}
                    {visible < filtered.length && (
                        <button type="button" className={`button ${styles.more}`} onClick={() => setVisible(visible + PAGE_SIZE)}>
                            Show older headlines
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default News;
