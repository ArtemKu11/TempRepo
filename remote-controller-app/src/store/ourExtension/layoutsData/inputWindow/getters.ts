import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { InputWindowState } from "./types";

export const getters: GetterTree<InputWindowState, RootState> = {
    getInputWindowData(state) {
        return state.inputWindowData;
    },

    getProcessingValue(state) {
        return state.processingValue;
    },

    getKeyboardFlag: state => () => {
        return state.keyboardFlag;
    },

    getValcoderStep(state) {
        return state.valcoderStep
    },

    getFlags(state) {
        return state.flags;
    },

    getFinalValue(state) {
        return state.finalValue;
    }
}