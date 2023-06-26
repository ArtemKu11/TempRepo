import { ActionTree } from "vuex";
import { TempState } from "./types";
import { RootState } from "@/store/types";
import { falseState } from "./state";

export const actions: ActionTree<TempState, RootState> = {
    openFileSelectWindow({ state }) {
        const falsedState = falseState()
        falsedState.fileSelectWindow = true
        Object.assign(state, falsedState)
    },

    openPrintWindow({ state }) {
        const falsedState = falseState()
        falsedState.printWindow = true
        Object.assign(state, falsedState)
    },

    openOscillationWindow({ state }) {
        const falsedState = falseState()
        falsedState.oscillationWindow = true
        Object.assign(state, falsedState)
        console.log(state)
    },
}