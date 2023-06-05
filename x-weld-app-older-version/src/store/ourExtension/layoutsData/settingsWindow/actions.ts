import { ActionTree } from "vuex";
import { SettingsWindowState } from "./types";
import { RootState } from "@/store/types";

export const actions: ActionTree<SettingsWindowState, RootState> = {
    setLastCoords({state}, payload: number[]) {
        state.lastCoords = payload
    },

    setMaintenanceFlag({state}, payload: boolean) {
        state.maintenanceFlag = payload
    }
}