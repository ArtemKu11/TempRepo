import { MutationTree } from "vuex";
import { defaultState } from "./state";
import { MoveWindowState } from "./types";

export const mutations: MutationTree<MoveWindowState> = {
    setReset(state) {
        Object.assign(state, defaultState())
    },

    setCurrentStep(state, newStep) {
        state.stepSelectorInfo.currentStep = newStep;
    },

    setX(state, newX) {
        state.coordinates.x = newX;
    },

    setY(state, newY) {
        state.coordinates.y = newY;
    },

    setZ(state, newZ) {
        state.coordinates.z = newZ;
    },

    setNeedToSendGcodeMove(state, newFlag: boolean) {
        state.needToSendGcodeMove = newFlag;
    }
}