import { MutationTree } from "vuex";
import { EncoderState, GpioState } from "./types";

export const mutations: MutationTree<GpioState> = {
    setSocketConnected(state, payload: boolean) {
        state.isSocketConnected = payload
    },

    setFirstButton(state, payload: boolean) {
        state.buttonsState.firstButton = payload
    },

    setSecondButton(state, payload: boolean) {
        state.buttonsState.secondButton = payload
    },

    setThirdButton(state, payload: boolean) {
        state.buttonsState.thirdButton = payload
    },

    setFourthButton(state, payload: boolean) {
        state.buttonsState.fourthButton = payload
    },

    setFifthButton(state, payload: boolean) {
        state.buttonsState.fifthButton = payload
    },

    setSixthButton(state, payload: boolean) {
        state.buttonsState.sixthButton = payload
    },

    setEncoder1(state, payload: EncoderState) {
        state.encoderState.encoder1 = payload
    },

    setEncoder2(state, payload: EncoderState) {
        state.encoderState.encoder2 = payload
    }
}