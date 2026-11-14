import { store } from "@/Redux/store";
import hydrateSave from "@/Redux/Thunks/hydrateSave";

let currentUserId: string | null = null;

store.subscribe(() => {
    const userId = store.getState().auth.user?.id ?? null;
    if (userId === currentUserId) return;

    currentUserId = userId;
    if (userId) store.dispatch(hydrateSave(userId));
});
