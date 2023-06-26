import { MutationTree } from "vuex";
import { defaultState } from "./state";
import { FlagsObject, InputWindowData, InputWindowState } from "./types";
import { TimeProcessor } from "@/components/inputWindow/timeProcessor";

export const mutations: MutationTree<InputWindowState> = {
    setInputWindowData(state, payload: InputWindowData) {
        const callback = payload.callbackAfterConfirm;
        state.inputWindowData = JSON.parse(JSON.stringify(payload));
        if (state.inputWindowData) {
            state.inputWindowData.callbackAfterConfirm = callback
        }
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
            if (state.inputWindowData?.isItTime) {
                state.processingValue = TimeProcessor.toTime(TimeProcessor.toSeconds(state.processingValue))
            } else {
                state.processingValue = +state.processingValue + '';
            }
        }
        state.keyboardFlag = newFlag;
    },

    setValcoderStep(state, step) {
        state.valcoderStep = step;
    },

    setFlags(state, flags: FlagsObject) {
        state.flags = flags;
    },

    rejectPointClick(state) {
        state.rejectPointClick = true;
    }
}