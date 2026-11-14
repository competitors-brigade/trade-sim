import { useEffect, useState, type RefObject } from "react";

const useElementWidth = (ref: RefObject<HTMLElement | null>) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        setWidth(Math.floor(element.getBoundingClientRect().width));
        const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
        observer.observe(element);
        return () => observer.disconnect();
    }, [ref]);

    return width;
};

export default useElementWidth;
