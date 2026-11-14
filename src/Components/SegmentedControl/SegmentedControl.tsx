import { cx } from "@/util/ui/classNames";
import styles from "./SegmentedControl.module.css";

interface SegmentedOption<T extends string> {
    value: T;
    label: string;
}

interface SegmentedControlProps<T extends string> {
    label: string;
    options: ReadonlyArray<SegmentedOption<T>>;
    value: T;
    onChange: (value: T) => void;
}

const SegmentedControl = <T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) => (
    <div className={styles.group} role="radiogroup" aria-label={label}>
        {options.map((option) => (
            <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={option.value === value}
                className={cx(styles.option, option.value === value && styles.active)}
                onClick={() => onChange(option.value)}
            >
                {option.label}
            </button>
        ))}
    </div>
);

export default SegmentedControl;
export type { SegmentedControlProps, SegmentedOption };
