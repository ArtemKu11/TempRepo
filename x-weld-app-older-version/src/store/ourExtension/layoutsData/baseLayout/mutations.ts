import { MutationTree } from "vuex";
import { BaseLayoutState } from "./types";

export const mutations: MutationTree<BaseLayoutState> = {
    refreshTime(state) {
        const date = new Date();
        let hours = date.getHours() + "";
        let minutes = date.getMinutes() + "";
        if (hours.length === 1) {
            hours = "0" + hours;
        }
        if (minutes.length === 1) {
            minutes = "0" + minutes;
        }
        state.actualTime =  `${hours}:${minutes}`
    }
}