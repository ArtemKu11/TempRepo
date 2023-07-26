import { GornState } from "./types"

export const defaultState = (): GornState => {
    return {
        clientState: {
            unit_1: {
                currentDesired: 0,
                voltageDesired: 0
            }
        }
    }
}

export const state = defaultState()