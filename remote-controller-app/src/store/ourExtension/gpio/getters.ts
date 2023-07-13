import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { GpioState } from "./types";

export const getters: GetterTree<GpioState, RootState> = {
    getSocketConnected(state) {
        return state.isSocketConnected
    },

    getFirstButton(state) {
        return state.buttonsState.firstButton
    },

    getSecondButton(state) {
        return state.buttonsState.secondButton
    },

    getThirdButton(state) {
        return state.buttonsState.thirdButton
    },

    getFourthButton(state) {
        return state.buttonsState.fourthButton
    },

    getFifthButton(state) {
        return state.buttonsState.fifthButton
    },

    getSixthButton(state) {
        return state.buttonsState.sixthButton
    },

    getEncoder1(state) {
        return state.encoderState.encoder1
    },

    getEncoder2(state) {
        return state.encoderState.encoder2
    }
}