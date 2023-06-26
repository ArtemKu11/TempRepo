import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { BaseLayoutState } from "./types";

export const actions: ActionTree<BaseLayoutState, RootState> = {
    startTimeRefreshing({ commit, dispatch }) {
        commit('refreshTime');
        setTimeout(() => dispatch('startTimeRefreshing'), 10000)
    }
}