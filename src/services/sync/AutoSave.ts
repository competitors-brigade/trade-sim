import { store } from "@/Redux/store";
import { writePreferences } from "@/services/storage/Preferences";
import { SAVE_VERSION, writeSave } from "@/services/storage/SaveGame";

const SAVE_DELAY_MS = 400;

let timer: number | undefined;
let last = store.getState();

const flush = () => {
    window.clearTimeout(timer);
    timer = undefined;

    const { auth, simulation, portfolio } = store.getState();
    if (!auth.user || auth.loadedSaveFor !== auth.user.id) return;
    writeSave(auth.user.id, { version: SAVE_VERSION, simulation, portfolio });
};

store.subscribe(() => {
    const state = store.getState();

    if (state.settings.hydrated && state.settings.theme !== last.settings.theme) {
        writePreferences({ theme: state.settings.theme });
    }

    const changed =
        state.simulation !== last.simulation ||
        state.portfolio !== last.portfolio ||
        state.auth.loadedSaveFor !== last.auth.loadedSaveFor;
    last = state;
    if (!changed) return;

    window.clearTimeout(timer);
    timer = window.setTimeout(flush, SAVE_DELAY_MS);
});

window.addEventListener("pagehide", flush);
