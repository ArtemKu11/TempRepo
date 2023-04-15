import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { MoveWindowState } from "./types";

export const getters: GetterTree<MoveWindowState, RootState> = {
    // get gcodePosition() {
    //     return this.$store.state.printer.printer.gcode_move.gcode_position
    // }
    
    //   get toolheadPosition() {
    //     return this.$store.state.printer.printer.toolhead.position
    // }
    getCoordinates(state, getters, rootState, rootGetters) {
        return rootState.printer.printer.toolhead.position
        // return state.coordinates;
    },

    getStepSelectorInfo(state) {
        return state.stepSelectorInfo;
    },

    getCurrentStep(state) {
        return state.stepSelectorInfo.currentStep;
    },
    
    getNeedToSendGCodeMove(state) {
        return state.needToSendGcodeMove;
    } 
}