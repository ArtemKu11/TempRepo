import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { LightFilesState } from "./types";

export const getters: GetterTree<LightFilesState, RootState> = {
    getListOfFilesAndDirs(state) {
        if (state.dirs[0] && state.dirs[0].name === "gcodes") {
            return state.dirs[0]
        } else {
            return []
        }
    },

    getDirs(state) {
        return state.dirs
    },

    getFilesLoadingFinishedFlag: (state) => {
        return state.isLoadingFinish;
    },

    getFilesMap(state) {
        return state.fileSystem;
    }
}