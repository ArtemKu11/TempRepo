import { GpioState } from "./types";

export const defaultState = (): GpioState => {
    return {
        isSocketConnected: false,
        buttonsState: {
            firstButton: false,
            secondButton: false,
            thirdButton: false,
            fourthButton: false,
            fifthButton: false,
            sixthButton: false
        }
    }
}

export const state = defaultState()