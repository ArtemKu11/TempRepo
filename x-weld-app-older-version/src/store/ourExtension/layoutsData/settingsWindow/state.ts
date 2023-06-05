import { SettingsWindowState } from "./types";

export const defaultState = (): SettingsWindowState => {
    return {
        maintenanceFlag: false,
        lastCoords: []
    }
}

export const state = defaultState()