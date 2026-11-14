import { store } from "@/Redux/store";

const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

const applyTheme = () => {
    const { theme } = store.getState().settings;
    const resolved = theme === "system" ? (darkQuery.matches ? "dark" : "light") : theme;
    if (document.documentElement.dataset.theme !== resolved) {
        document.documentElement.dataset.theme = resolved;
    }
};

store.subscribe(applyTheme);
darkQuery.addEventListener("change", applyTheme);
applyTheme();
