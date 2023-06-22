import { TempState } from "./types";

export const defaultState = (): TempState => {
    return {
        fileSelectWindow: true,
        oscillationWindow: false,
        printWindow: false
    }
}

export const falseState = (): TempState => {
    return {
        fileSelectWindow: false,
        oscillationWindow: false,
        printWindow: false
    }
}

export const state = defaultState()