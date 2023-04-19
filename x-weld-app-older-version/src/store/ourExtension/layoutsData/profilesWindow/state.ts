import { ProfilesWindowState } from "./types";

export const defaultState = (): ProfilesWindowState => {
    return {
        file: null,
        headerText: 'Последняя печать',
        layersText: '',
        lastPrintingProfileFlag: true,
        layersSetupWindowFlag: false
    }
}

export const state = defaultState()