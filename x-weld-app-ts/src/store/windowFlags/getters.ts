import { GetterTree } from "vuex";
import { MainState } from "../types";
import { initWindowFlags } from "./state";
import { FlagsObject, WindowFlagsState } from "./types";

export const getters: GetterTree<WindowFlagsState, MainState> =  {
    getMainWindowFlag(state: WindowFlagsState): boolean {
        return state.flags.mainWindowFlag;
    },

    getFileBrowseWindowFlag(state: WindowFlagsState): boolean {
        return state.flags.fileBrowseWindowFlag;
    },

    getFilePreviewWindowFlag(state: WindowFlagsState): boolean {
        return state.flags.filePreviewWindowFlag;
    },

    getCurrentFlagsObject: state => (): FlagsObject => {
        return JSON.parse(JSON.stringify(state.flags))
    },

    getInitFlagsObject: state => (): FlagsObject => {
        return JSON.parse(JSON.stringify(initWindowFlags)) 
    }
}