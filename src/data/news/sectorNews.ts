import type { SectorId } from "@/data/sectors";
import type { NewsTemplate, SentimentPair } from "@/types/market";

const SECTOR_NEWS: Record<SectorId, SentimentPair<NewsTemplate[]>> = {
    technology: {
        positive: [
            {
                headline: "Chipmakers rally as AI infrastructure spending accelerates",
                summary: "Cloud providers lifted capital spending plans, a signal that demand for processors and software tools is still building.",
            },
            {
                headline: "Enterprise software demand rebounds in industry survey",
                summary: "Corporate IT budgets are growing faster than forecast, with security and data tools leading the increase.",
            },
            {
                headline: "Trade group reports record quarterly semiconductor sales",
                summary: "Global shipments hit a new high, led by data-center and automotive customers.",
            },
        ],
        negative: [
            {
                headline: "New export curbs on advanced chips unsettle the technology sector",
                summary: "Tighter licensing rules could cut off a meaningful slice of overseas sales for hardware makers.",
            },
            {
                headline: "Corporate tech spending slows as buyers delay purchases",
                summary: "Several large customers have pushed back upgrade cycles, leaving suppliers with growing inventories.",
            },
            {
                headline: "Antitrust scrutiny of large technology platforms widens",
                summary: "Regulators opened parallel reviews, raising the prospect of forced changes to business practices across the industry.",
            },
        ],
    },
    energy: {
        positive: [
            {
                headline: "Crude climbs after producers extend output cuts",
                summary: "Supply discipline from major exporters tightened the market, and inventories are drawing faster than analysts expected.",
            },
            {
                headline: "Cold snap drives surge in natural gas demand",
                summary: "Heating demand outran forecasts, pulling storage levels well below the seasonal average.",
            },
            {
                headline: "Government expands incentives for renewable power projects",
                summary: "The package lowers financing costs for new solar and grid developments and extends tax credits by several years.",
            },
        ],
        negative: [
            {
                headline: "Oil slides as inventories build and demand forecasts soften",
                summary: "Stockpiles rose for a third straight week while agencies trimmed their estimates of global consumption.",
            },
            {
                headline: "Mild weather weighs on fuel and power demand",
                summary: "Consumption has run well below normal, leaving producers and utilities with more supply than customers.",
            },
            {
                headline: "Permitting delays stall new energy projects",
                summary: "Regulators pushed back several approvals, adding cost and uncertainty to the development pipeline.",
            },
        ],
    },
    healthcare: {
        positive: [
            {
                headline: "Regulators signal faster review pathway for new therapies",
                summary: "A revised approval framework could shorten development timelines and lower the cost of bringing drugs to market.",
            },
            {
                headline: "Hospital admissions rise, lifting demand for care and diagnostics",
                summary: "Higher patient volumes are boosting revenue across providers and testing companies.",
            },
            {
                headline: "Lawmakers shelve proposed limits on drug pricing",
                summary: "The decision removes a key overhang for pharmaceutical and biotech companies.",
            },
        ],
        negative: [
            {
                headline: "Congress advances drug price caps",
                summary: "A bipartisan bill would limit what insurers pay for several high-cost treatments, squeezing industry margins.",
            },
            {
                headline: "Reimbursement cuts proposed for outpatient services",
                summary: "Providers and diagnostics firms could see lower payments if the draft rule is finalized as written.",
            },
            {
                headline: "High-profile clinical trial failure rattles healthcare investors",
                summary: "A closely watched late-stage study missed its main goal, prompting a broader reassessment of sector risk.",
            },
        ],
    },
    financials: {
        positive: [
            {
                headline: "Yield curve steepens, widening lending margins",
                summary: "Longer-term rates rose faster than short-term funding costs, a favorable setup for banks and lenders.",
            },
            {
                headline: "Stress tests show lenders well capitalized",
                summary: "Regulators found the largest institutions could absorb a severe downturn, opening the door to higher payouts.",
            },
            {
                headline: "Dealmaking and trading volumes climb",
                summary: "Advisory pipelines are full and trading desks report their busiest stretch in more than a year.",
            },
        ],
        negative: [
            {
                headline: "Regulators propose higher capital requirements",
                summary: "Stricter rules would force lenders to hold more reserves, limiting buybacks and loan growth.",
            },
            {
                headline: "Loan delinquencies tick higher across consumer portfolios",
                summary: "Late payments rose for the third consecutive month, raising concerns about credit losses.",
            },
            {
                headline: "Insurers face heavy claims after a string of severe storms",
                summary: "Catastrophe losses are tracking above the annual budget for several large underwriters.",
            },
        ],
    },
    consumer: {
        positive: [
            {
                headline: "Consumer confidence reaches its highest level in years",
                summary: "Households reported improving job prospects and signaled plans to spend more on big-ticket items.",
            },
            {
                headline: "Holiday-quarter spending forecasts revised upward",
                summary: "Retail groups now expect stronger sales growth than they projected a month ago, driven by discretionary categories.",
            },
            {
                headline: "Wage growth outpaces inflation for the first time in a year",
                summary: "Real incomes are rising again, supporting spending on food, autos and entertainment.",
            },
        ],
        negative: [
            {
                headline: "Retail sales fall short as households pull back",
                summary: "Spending on discretionary goods declined, and shoppers shifted toward cheaper alternatives.",
            },
            {
                headline: "Rising input costs squeeze consumer brands",
                summary: "Food, packaging and freight costs climbed again, and companies are finding it harder to pass them on.",
            },
            {
                headline: "Credit card balances hit a record as savings dwindle",
                summary: "Analysts warn that stretched household budgets could weigh on spending in coming months.",
            },
        ],
    },
    industrials: {
        positive: [
            {
                headline: "Infrastructure package lifts industrial order books",
                summary: "Newly approved funding is expected to drive demand for equipment, materials and freight capacity.",
            },
            {
                headline: "Factory activity expands at the fastest pace in two years",
                summary: "A closely watched manufacturing survey rose well above the expansion threshold, led by new orders.",
            },
            {
                headline: "Air travel and cargo volumes reach new highs",
                summary: "Carriers are adding capacity, supporting orders across aerospace and logistics.",
            },
        ],
        negative: [
            {
                headline: "Factory orders contract for a third straight month",
                summary: "Manufacturers are drawing down backlogs and delaying capital projects as demand weakens.",
            },
            {
                headline: "Freight volumes fall as trade slows",
                summary: "Shippers and carriers report softer bookings, with rates falling on major routes.",
            },
            {
                headline: "Labor dispute threatens production at several major plants",
                summary: "Talks stalled and a strike deadline is approaching, putting output and delivery schedules at risk.",
            },
        ],
    },
};

export { SECTOR_NEWS };
