import { preferencesLoaded } from "@/Redux/actions";
import { loadPreferences } from "@/services/storage/Preferences";
import type { AppThunk } from "@/Redux/store";

const hydratePreferences = (): AppThunk => (dispatch) => {
    dispatch(preferencesLoaded(loadPreferences()));
};

export default hydratePreferences;
