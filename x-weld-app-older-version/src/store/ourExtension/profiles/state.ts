import { ProfilesState } from "./types";

export const defaultState = (): ProfilesState => {
    return {
        profilesList: [],
        lastPrintingProfile: null,
        profilesMetadata: null
    }
}

export const state = defaultState();