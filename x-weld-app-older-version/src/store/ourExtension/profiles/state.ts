import { ProfilesState } from "./types";

export const defaultState = (): ProfilesState => {
    return {
        profilesList: [],
        lastSelectedProfile: null
    }
}

export const state = defaultState();