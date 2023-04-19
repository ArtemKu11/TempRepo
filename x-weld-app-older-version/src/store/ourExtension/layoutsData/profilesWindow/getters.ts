import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { resolveIconByProfileName } from "../../profiles/helpers";
import { PrintingDiapason } from "../../profiles/types";
import { ProfilesWindowState } from "./types";

export const getters: GetterTree<ProfilesWindowState, RootState> = {
    getFile(state) {
        return state.file
    },

    getSelectedDiapason: (state) => () => {
        return state.selectedDiapason
    },

    getLayersSetupWindowFlag(state) {
        return state.layersSetupWindowFlag;
    },

    getHeaderText(state) {
        return state.headerText
    },

    getLayersText(state) {
        return state.layersText
    },

    getProfilesNamesList: (state) => () => {
        const profilesMap: Map<string, PrintingDiapason> | undefined = state.file?.profiles?.profiles
        if (profilesMap) {
            const keys: IterableIterator<string> = profilesMap.keys()
            const keysArr: string[] = Array.from(keys)
            return keysArr.sort()
        }
    },

    getProfilesNamesMap: (state) => () => {
        if (!state.globalProfilesInitialisationFlag) {
            const profilesMap: Map<string, PrintingDiapason> | undefined = state.file?.profiles?.profiles
            if (profilesMap) {
                const keys: IterableIterator<string> = profilesMap.keys()
                const keysArr: string[] = Array.from(keys).sort()
                const map = new Map();
                for (const key of keysArr) {
                    const iconText = resolveIconByProfileName(key);
                    map.set(key, iconText);
                }
                return map;
            }
        } else {
            const profilesMap: Map<string, PrintingDiapason> | undefined = state.globalProfilesMap
            if (profilesMap) {
                const keys: IterableIterator<string> = profilesMap.keys()
                const keysArr: string[] = Array.from(keys).sort()
                const map = new Map();
                for (const key of keysArr) {
                    const iconText = resolveIconByProfileName(key);
                    map.set(key, iconText);
                }
                return map;
            }
        }

    },

    isItLastPrintingProfile(state) {
        return state.lastPrintingProfileFlag
    },

    isItInitWithGlobalProfiles: (state) => () => {
        return state.globalProfilesInitialisationFlag
    }
}