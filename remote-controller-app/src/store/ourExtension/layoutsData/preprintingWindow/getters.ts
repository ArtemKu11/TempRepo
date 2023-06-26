import { GetterTree } from "vuex";
import { PreprintingWindowState } from "./types";
import { RootState } from "@/store/types";

export const getters: GetterTree<PreprintingWindowState, RootState> = {
    isFileInit: (state) => () => {
        return Boolean(state.file)
    },

    getFile: (state) => () => {
        return state.file
    }
}