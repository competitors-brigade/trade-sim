import { GAME_RULES } from "@/data/gameRules";
import { STOCKS_BY_SYMBOL } from "@/data/stocks";
import { orderFilled } from "@/Redux/Slices/portfolioSlice";
import { getPrice } from "@/services/market/Market";
import { formatInteger, formatMoney } from "@/util/format/numbers";
import type { OrderRequest, OrderResult } from "@/types/game";
import type { AppThunk } from "@/Redux/store";

const reject = (reason: string): OrderResult => ({ ok: false, reason });

const placeOrder =
    ({ symbol, side, shares }: OrderRequest): AppThunk<OrderResult> =>
    (dispatch, getState) => {
        const { simulation, portfolio } = getState();

        if (!STOCKS_BY_SYMBOL[symbol]) return reject(`Unknown symbol ${symbol}.`);
        if (simulation.hour >= GAME_RULES.hoursPerYear) return reject("The year is over. Trading is closed.");
        if (!Number.isInteger(shares) || shares < 1) return reject("Enter a whole number of shares.");

        const price = getPrice(symbol, simulation.hour);

        if (side === "buy") {
            const cost = shares * price;
            if (cost > portfolio.cash) {
                return reject(`Not enough cash. This order costs ${formatMoney(cost)} and you have ${formatMoney(portfolio.cash)}.`);
            }
        } else {
            const held = portfolio.positions[symbol]?.shares ?? 0;
            if (shares > held) return reject(`You only hold ${formatInteger(held)} shares of ${symbol}.`);
        }

        dispatch(orderFilled({ symbol, side, shares, price, hour: simulation.hour }));
        return { ok: true, trade: getState().portfolio.trades[0] };
    };

export default placeOrder;
