import { useAppSelector } from "@/Hooks/redux";
import { selectPortfolioSummary, selectPositions, selectTrades } from "@/Redux/selectors";

const usePortfolioSummary = () => useAppSelector(selectPortfolioSummary);
const usePositions = () => useAppSelector(selectPositions);
const useTrades = () => useAppSelector(selectTrades);

export { usePortfolioSummary, usePositions, useTrades };
