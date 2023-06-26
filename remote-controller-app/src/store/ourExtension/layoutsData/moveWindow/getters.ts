import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { MoveWindowState } from "./types";
import { round } from "./helpers";

export const getters: GetterTree<MoveWindowState, RootState> = {
    // get gcodePosition() {
    //     return this.$store.state.printer.printer.gcode_move.gcode_position
    // }
    
    //   get toolheadPosition() {
    //     return this.$store.state.printer.printer.toolhead.position
    // }
    getCoordinates: (state, getters, rootState) => () => {
        const toolheadPosition = rootState.printer.printer.toolhead.position
        const newArr = []
        for (let coord of toolheadPosition) {
            newArr.push(round(coord))
        }
        return newArr
        // return state.coordinates;
    },

    getMaxCoordinates: (state, getters, rootState) => () => {
        let maxCoordinates = rootState.printer.printer.toolhead.axis_maximum
        if (!maxCoordinates || !maxCoordinates.length) {
            maxCoordinates = [1000, 1000, 1000]
        }
        const newArr = []
        for (let coord of maxCoordinates) {
            newArr.push(round(coord))
        }
        return newArr
    },

    getMinCoordinates: (state, getters, rootState) => () => {
        let minCoordinates = rootState.printer.printer.toolhead.axis_minimum
        if (!minCoordinates || !minCoordinates.length) {
            minCoordinates = [-1000, -1000, -1000]
        }
        const newArr = []
        for (let coord of minCoordinates) {
            newArr.push(round(coord))
        }
        return newArr
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