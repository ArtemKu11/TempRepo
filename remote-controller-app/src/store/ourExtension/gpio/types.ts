export interface GpioState {
    isSocketConnected: boolean
    buttonsState: ButtonsState
    encoderState: EncodersState
}

export interface ButtonsState {
    firstButton: boolean
    secondButton: boolean
    thirdButton: boolean
    fourthButton: boolean
    fifthButton: boolean
    sixthButton: boolean
}

export interface EncodersState {
    encoder1: EncoderState
    encoder2: EncoderState
}

export interface EncoderState {
    emited: boolean
    isClockwise: boolean
}