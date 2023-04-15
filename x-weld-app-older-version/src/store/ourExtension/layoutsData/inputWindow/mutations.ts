import { MutationTree } from "vuex";
import { defaultState } from "./state";
import { FlagsObject, InputWindowData, InputWindowState } from "./types";

export const mutations: MutationTree<InputWindowState> = {
    setInputWindowData(state, payload: InputWindowData) {
        state.inputWindowData = JSON.parse(JSON.stringify(payload));
    },

    setProcessingValue(state, payload: string) {
        state.processingValue = payload;
    },

    setFinalValue(state, payload: number) {
        state.finalValue = payload
    },

    reset(state) {
        Object.assign(state, defaultState())
    },

    setKeyboardFlag(state, newFlag) {
        if (!newFlag) {
            state.processingValue = +state.processingValue + '';
        }
        state.keyboardFlag = newFlag;
    },

    setValcoderStep(state, step) {
        state.valcoderStep = step;
    },

    setFlags(state, flags: FlagsObject) {
        state.flags = flags;
    }
}