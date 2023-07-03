export interface GpioState {
    isSocketConnected: boolean
    buttonsState: ButtonsState
}

export interface ButtonsState {
    firstButton: boolean
    secondButton: boolean
    thirdButton: boolean
    fourthButton: boolean
    fifthButton: boolean
    sixthButton: boolean
}