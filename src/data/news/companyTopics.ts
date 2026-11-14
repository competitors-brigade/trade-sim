import type { NewsTemplate, SentimentPair } from "@/types/market";

const COMPANY_TOPICS: readonly SentimentPair<NewsTemplate>[] = [
    {
        positive: {
            headline: "{name} beats quarterly estimates on stronger demand",
            summary: "Revenue and earnings per share came in above consensus, and management pointed to improving order trends heading into the next quarter.",
        },
        negative: {
            headline: "{name} misses quarterly earnings expectations",
            summary: "Revenue fell short of consensus and margins narrowed, with executives citing softer demand and higher operating costs.",
        },
    },
    {
        positive: {
            headline: "{name} raises full-year outlook",
            summary: "Management lifted its revenue and profit guidance, saying visibility into the second half has improved.",
        },
        negative: {
            headline: "{name} cuts full-year guidance",
            summary: "The company lowered its forecast and warned that conditions are likely to stay difficult for several quarters.",
        },
    },
    {
        positive: {
            headline: "{name} unveils next-generation product line",
            summary: "Early reviews and pre-orders are running ahead of internal targets, and analysts expect the launch to lift market share.",
        },
        negative: {
            headline: "{name} delays flagship launch",
            summary: "A manufacturing issue pushed the release back by at least two quarters, giving competitors an opening.",
        },
    },
    {
        positive: {
            headline: "{name} wins multi-year contract worth hundreds of millions",
            summary: "The agreement is expected to add recurring revenue and was awarded after a competitive bidding process.",
        },
        negative: {
            headline: "{name} loses a major customer to a rival",
            summary: "The customer accounted for a meaningful share of revenue, and the company has not said how it will replace the volume.",
        },
    },
    {
        positive: {
            headline: "Regulators clear the way for {name}",
            summary: "A pending approval was granted earlier than expected, removing a key uncertainty for the business.",
        },
        negative: {
            headline: "{name} faces a regulatory investigation",
            summary: "Authorities opened an inquiry into the company's practices, and legal costs and possible fines are hard to estimate.",
        },
    },
    {
        positive: {
            headline: "{name} appoints a respected industry veteran as chief executive",
            summary: "Investors welcomed the choice, citing a record of turning around comparable businesses.",
        },
        negative: {
            headline: "{name} chief financial officer resigns abruptly",
            summary: "The departure came with no successor named, raising questions about internal controls and the outlook.",
        },
    },
    {
        positive: {
            headline: "Analysts upgrade {name} to buy",
            summary: "Several brokers raised their price targets, pointing to improving fundamentals and a valuation that still looks undemanding.",
        },
        negative: {
            headline: "{name} downgraded on valuation and growth concerns",
            summary: "Analysts cut their ratings and price targets, arguing that the stock already reflects an optimistic outcome.",
        },
    },
    {
        positive: {
            headline: "{name} secures long-term supply agreement",
            summary: "Locking in inputs at fixed prices should ease cost pressure and make margins more predictable.",
        },
        negative: {
            headline: "{name} warns of supply chain disruption",
            summary: "Shortages of key components are expected to slow shipments and push up costs over the coming months.",
        },
    },
    {
        positive: {
            headline: "{name} agrees to acquire a smaller rival",
            summary: "The deal is expected to add to earnings within a year and broaden the company's product range.",
        },
        negative: {
            headline: "{name} faces investor backlash over acquisition price",
            summary: "Shares fell as analysts questioned the price and the integration risks attached to the purchase.",
        },
    },
    {
        positive: {
            headline: "{name} expands share buyback and raises dividend",
            summary: "The board authorized a larger repurchase program, signaling confidence in the company's cash generation.",
        },
        negative: {
            headline: "{name} launches share offering to raise capital",
            summary: "The sale will dilute existing holders, and the timing suggests the company needs funding sooner than expected.",
        },
    },
    {
        positive: {
            headline: "{name} reports {pct}% revenue growth in {quarter}",
            summary: "The company said sales rose {pct}% from a year earlier, helped by pricing and higher volumes.",
        },
        negative: {
            headline: "{name} revenue slips {pct}% in {quarter}",
            summary: "Sales declined from a year earlier as customers cut orders, and management offered few signs of a near-term recovery.",
        },
    },
    {
        positive: {
            headline: "{name} lands {amount} order from a long-time customer",
            summary: "The order extends an existing relationship and is expected to ship over the next several quarters.",
        },
        negative: {
            headline: "{name} customer cancels {amount} order",
            summary: "The cancellation removes a chunk of expected revenue and raises questions about the order backlog.",
        },
    },
    {
        positive: {
            headline: "{name} margins expand as costs come in below plan",
            summary: "Cost discipline and a better product mix pushed profitability above analyst forecasts.",
        },
        negative: {
            headline: "{name} margins compress on rising costs",
            summary: "Higher labor and materials costs outpaced pricing, and the company expects the pressure to continue.",
        },
    },
    {
        positive: {
            headline: "{name} opens new facility to meet demand",
            summary: "The expansion is expected to lift capacity by roughly {pct}% and shorten delivery times.",
        },
        negative: {
            headline: "{name} to close facilities in restructuring",
            summary: "The plan cuts about {pct}% of capacity and will carry one-time charges over the next few quarters.",
        },
    },
    {
        positive: {
            headline: "Insiders buy {name} shares ahead of the next report",
            summary: "Several executives and directors disclosed open-market purchases, which investors read as a vote of confidence.",
        },
        negative: {
            headline: "Executives sell {name} shares ahead of the next report",
            summary: "Filings show several insiders reduced their holdings, drawing attention from investors.",
        },
    },
    {
        positive: {
            headline: "{name} settles litigation on favorable terms",
            summary: "The agreement resolves a long-running dispute for less than analysts had reserved.",
        },
        negative: {
            headline: "{name} hit with adverse legal ruling",
            summary: "A court ruled against the company in a long-running case, and the damages could exceed what it had set aside.",
        },
    },
    {
        positive: {
            headline: "{name} expands into new international markets",
            summary: "The company announced launches in several regions, which management expects to add meaningfully to revenue by next year.",
        },
        negative: {
            headline: "{name} pulls back from international expansion",
            summary: "Weak early results led the company to scale back its overseas plans and take a related charge.",
        },
    },
    {
        positive: {
            headline: "{name} customer satisfaction scores hit a record",
            summary: "A widely followed survey placed the company at the top of its peer group, a possible sign of pricing power.",
        },
        negative: {
            headline: "{name} faces customer complaints and a product recall",
            summary: "Reports of quality problems prompted a voluntary recall, and analysts are weighing the cost to the brand.",
        },
    },
    {
        positive: {
            headline: "{name} refinances debt at lower rates",
            summary: "The transaction extends maturities and trims annual interest costs, improving the balance sheet.",
        },
        negative: {
            headline: "{name} credit outlook cut by rating agency",
            summary: "The downgrade raises borrowing costs and adds pressure on a balance sheet already carrying significant debt.",
        },
    },
    {
        positive: {
            headline: "{name} forms joint venture with a leading rival",
            summary: "The tie-up shares costs and opens a new revenue stream, according to the announcement.",
        },
        negative: {
            headline: "{name} loses key executives to a competitor",
            summary: "A group of senior leaders announced departures this week, raising concerns about execution.",
        },
    },
];

export { COMPANY_TOPICS };
