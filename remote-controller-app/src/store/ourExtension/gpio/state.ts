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
        },
        encoderState: {
            encoder1: {
                emited: false,
                isClockwise: false
            }
        }
    }
}

export const state = defaultState()