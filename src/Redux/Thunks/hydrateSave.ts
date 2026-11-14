import { saveLoaded } from "@/Redux/actions";
import { loadSave } from "@/services/storage/SaveGame";
import type { AppThunk } from "@/Redux/store";

const hydrateSave =
    (userId: string): AppThunk =>
    (dispatch) => {
        dispatch(saveLoaded({ userId, save: loadSave(userId) }));
    };

export default hydrateSave;
