import { SettingsWindowState } from "./types";

export const defaultState = (): SettingsWindowState => {
    return {
        maintenanceFlag: false,
        lastCoords: [],
        backClickFlagForConsole: false
    }
}

export const state = defaultState()