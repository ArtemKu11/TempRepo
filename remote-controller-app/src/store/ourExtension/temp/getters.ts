import { GetterTree } from "vuex";
import { TempState } from "./types";
import { RootState } from "@/store/types";

export const getters: GetterTree<TempState, RootState> = {
    fileSelectWindowFlag(state) {
        return state.fileSelectWindow
    },

    oscillationWindowFlag(state) {
        return state.oscillationWindow
    },

    printWindowFlag(state) {
        return state.printWindow
    }
}