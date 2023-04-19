import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { PrintingDiapason, ProfilesState } from "./types";

export const getters: GetterTree<ProfilesState, RootState> = {
    getDefaultProfilesMap(state) {
        const defaultMap: Map<string, PrintingDiapason> = new Map();
        for (const profile of state.profilesList) {
            const rootDiapason: PrintingDiapason = {
                isRootDiapason: true,
                profile: profile
            }
            defaultMap.set(profile.name, rootDiapason)
        }
        return defaultMap;
    },

    getLastPrintingProfile: (state) => () => {
        return JSON.parse(JSON.stringify(state.lastPrintingProfile))
    },

    getProfilesMetadata(state) {
        return state.profilesMetadata
    }
}