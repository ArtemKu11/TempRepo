import { GetterTree } from "vuex";
import { PrintingWindowState } from "./types";
import { RootState } from "@/store/types";

export const getters: GetterTree<PrintingWindowState, RootState> = {
    getPrintingSettings(state) {
        return state.printingSettings
    },

    getPrintingDiapason: (state) => () => {
        return state.printingDiapason
    },

    getShift(state) {
        return state.shift
    },
    
    getFile: (state) => () => {
        return state.file
    }
}