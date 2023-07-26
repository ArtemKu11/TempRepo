import { RootState } from "@/store/types";
import { GornClientState, GornState } from "./types";
import { GetterTree } from "vuex";

export const getters: GetterTree<GornState, RootState> = { 
    getGornServerState(state, getters, rootState, rootGetters): GornClientState | undefined {
        const printerState = rootState.printer.printer
        if (printerState && printerState.gorn_modbus) {
            return printerState.gorn_modbus
        }
    },

    getGornClientState(state): GornClientState {
        return state.clientState
    },

    getTotalModulesCount(state, getters, rootState, rootGetters): number {
        const gornServerState = getters['getGornServerState']
        if (gornServerState) {
            return Object.keys(gornServerState).length
        } else {
            return 0
        }
    }
}