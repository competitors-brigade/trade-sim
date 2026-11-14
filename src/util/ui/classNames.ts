type ClassValue = string | false | null | undefined;

const cx = (...values: ClassValue[]) => values.filter(Boolean).join(" ");

export { cx };
export type { ClassValue };
