import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { getSortedMapKeys } from "./helpers";
import { PrintingDiapason, Profile, ProfilesState } from "./types";

export const actions: ActionTree<ProfilesState, RootState> = {
    setProfiles({ commit, getters, dispatch }, payload: Profile[]) {
        commit('setProfiles', payload)
        const profilesMap: Map<string, PrintingDiapason> = getters['getDefaultProfilesMap']

        let profile = JSON.parse(JSON.stringify(profilesMap.get('Нержавеющие стали')))
        if (!profile) {
            const keys = getSortedMapKeys(profilesMap)
            profile = JSON.parse(JSON.stringify(profilesMap.get(keys[0])))
        }
        commit('setLastPrintingProfile', profile.profile)
        dispatch('ourExtension/files/setProfilesForAllGcodes', profilesMap, { root: true })
    }
}