import { MutationTree } from "vuex";
import { Profile, ProfilesMetadata, ProfilesState } from "./types";

export const mutations: MutationTree<ProfilesState> = {
    setProfiles(state, payload: Profile[]) {
        state.profilesList = payload;
    },

    setProfilesMetadata(state, payload: ProfilesMetadata) {
        state.profilesMetadata = payload
    },

    setLastPrintingProfile(state, payload: Profile) {
        state.lastPrintingProfile = JSON.parse(JSON.stringify(payload))
    }
}