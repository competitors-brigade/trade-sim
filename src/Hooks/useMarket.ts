import { useMemo } from "react";
import { useAppSelector } from "@/Hooks/redux";
import { selectHour, selectQuotes } from "@/Redux/selectors";
import { STOCKS, STOCKS_BY_SYMBOL } from "@/data/stocks";

const useQuotes = () => useAppSelector(selectQuotes);

const useStock = (symbol: string | undefined) => {
    const hour = useAppSelector(selectHour);
    const quotes = useQuotes();

    return useMemo(() => {
        const definition = symbol ? STOCKS_BY_SYMBOL[symbol] : undefined;
        const quote = quotes.find((candidate) => candidate.symbol === symbol);
        return definition && quote ? { definition, quote, hour } : null;
    }, [symbol, quotes, hour]);
};

const useStockList = () => {
    const quotes = useQuotes();
    return useMemo(() => STOCKS.map((definition, index) => ({ definition, quote: quotes[index] })), [quotes]);
};

export { useQuotes, useStock, useStockList };
