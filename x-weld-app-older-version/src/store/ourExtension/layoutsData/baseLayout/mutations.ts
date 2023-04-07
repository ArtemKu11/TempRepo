import { MutationTree } from "vuex";
import { BaseLayoutState } from "./types";

export const mutations: MutationTree<BaseLayoutState> = {
    refreshTime(state) {
        const date = new Date();
        state.actualTime =  `${date.getHours()}:${date.getMinutes()}`
    }
}