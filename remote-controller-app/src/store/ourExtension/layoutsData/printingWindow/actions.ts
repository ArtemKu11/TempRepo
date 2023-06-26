import { ActionTree } from "vuex";
import { PrintingWindowState } from "./types";
import { RootState } from "@/store/types";
import { defaultState } from "./state";
import { PrintingDiapasonForMoonraker } from "../../profiles/types";
import { FileData } from "../../files/types";

export const actions: ActionTree<PrintingWindowState, RootState> = {
    reset({ state }) {
        Object.assign(state, defaultState())
    },

    setPrintingDiapason({ state }, payload: PrintingDiapasonForMoonraker) {
        state.printingDiapason = payload;
    },

    setFile({ state }, payload: FileData) {
        state.file = payload;
    }
}