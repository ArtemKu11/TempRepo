import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { SettingsWindowState } from "./types";

export const getters: GetterTree<SettingsWindowState, RootState> = {
    getLastCoords(state) {
        return state.lastCoords
    },

    getMaintenanceFlag(state) {
        return state.maintenanceFlag
    },

    getBackClickFlagForConsole(state) {
        return state.backClickFlagForConsole
    }
}