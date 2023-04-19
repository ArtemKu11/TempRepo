import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { SelectListWindowState } from "./types";

export const getters: GetterTree<SelectListWindowState, RootState> = {
    isItIconImplementation(state) {
        if (state.listItems[0] && state.listItems[0].icon) {
            return true
        }
        return false
    },

    getListItems(state) {
        return state.listItems
    },
}