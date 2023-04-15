import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { MoveWindowState } from "./types";

export const actions: ActionTree<MoveWindowState, RootState> = {
    reset({commit}) {
        commit("setReset")
    },
    
    setX({ commit }, newX) {
        commit('setX', newX)
    },

    setY({ commit }, newY) {
        commit('setY', newY)
    },

    setZ({ commit }, newZ) {
        commit('setZ', newZ)
    },

    setNeedToSendGcodeMove({ commit }) {
        commit('setNeedToSendGcodeMove', true)
    }
}