import styles from "./Sparkline.module.css";

interface SparklineProps {
    values: number[];
    width?: number;
    height?: number;
}

const Sparkline = ({ values, width = 96, height = 28 }: SparklineProps) => {
    if (values.length < 2) return <span className={styles.placeholder} aria-hidden="true" style={{ width, height }} />;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const inset = 2;
    const path = values
        .map((value, index) => {
            const x = (index / (values.length - 1)) * width;
            const y = inset + (1 - (value - min) / range) * (height - inset * 2);
            return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(" ");
    const positive = values[values.length - 1] >= values[0];

    return (
        <svg width={width} height={height} className={positive ? styles.positive : styles.negative} aria-hidden="true">
            <path d={path} className={styles.line} />
        </svg>
    );
};

export default Sparkline;
export type { SparklineProps };
