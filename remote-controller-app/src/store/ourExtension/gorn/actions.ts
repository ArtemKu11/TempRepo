import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { GornServerState, GornState } from "./types";
import Vue from 'vue'


export const actions: ActionTree<GornState, RootState> = {
    refreshClientState({ state, getters }) {
        const serverModulesCount = getters['getTotalModulesCount']
        if (serverModulesCount > 1) {
            const gornServerState = getters['getGornServerState'] as GornServerState
            for (const key in gornServerState) {
                if (!(key in state.clientState)) {
                    Vue.set(state.clientState, key, { currentDesired: gornServerState[key].current_setting, voltageDesired: gornServerState[key].voltage_setting })
                } else {
                    state.clientState[key].currentDesired = gornServerState[key].current_setting
                    state.clientState[key].voltageDesired = gornServerState[key].voltage_setting
                }
            }
        }
    }
}