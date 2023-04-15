import { MoveWindowState } from "./types";

export const defaultState = (): MoveWindowState => {
    return {
        coordinates: {
            x: 0,
            y: 0,
            z: 0
        },
        stepSelectorInfo: {
            currentStep: 1.0,
            stepValues: [0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 50.0],
            percentValues: [0, 17, 33.5, 50, 66.5, 83.5, 100]
        },
        needToSendGcodeMove: false
    }
}

export const state = defaultState()