interface PercentOptions {
    signed?: boolean;
    digits?: number;
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdWhole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdSigned = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", signDisplay: "exceptZero" });
const usdCompactSigned = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
});
const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const percentFormatters = new Map<string, Intl.NumberFormat>();

const getPercentFormatter = (signed: boolean, digits: number) => {
    const key = `${signed}:${digits}`;
    let formatter = percentFormatters.get(key);
    if (!formatter) {
        formatter = new Intl.NumberFormat("en-US", {
            style: "percent",
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
            signDisplay: signed ? "exceptZero" : "negative",
        });
        percentFormatters.set(key, formatter);
    }
    return formatter;
};

const formatMoney = (value: number) => usd.format(value);
const formatWholeMoney = (value: number) => usdWhole.format(value);
const formatSignedMoney = (value: number) => usdSigned.format(value);
const formatCompactSignedMoney = (value: number) => usdCompactSigned.format(value);
const formatInteger = (value: number) => integer.format(value);
const formatPercent = (fraction: number, { signed = false, digits = 2 }: PercentOptions = {}) =>
    getPercentFormatter(signed, digits).format(fraction);

export { formatMoney, formatWholeMoney, formatSignedMoney, formatCompactSignedMoney, formatInteger, formatPercent };
export type { PercentOptions };
