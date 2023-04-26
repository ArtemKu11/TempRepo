import { ActionTree } from "vuex";
import { PreprintingWindowState } from "./types";
import { RootState } from "@/store/types";
import { defaultState } from "./state";
import { FileData } from "../../files/types";

export const actions: ActionTree<PreprintingWindowState, RootState> = {
    reset({ state }) {
        console.log('reset')
        Object.assign(state, defaultState())
        state.file = null
    },

    initByFile({ state, commit }, payload: FileData) {
        commit('setFile', payload)
    }
}