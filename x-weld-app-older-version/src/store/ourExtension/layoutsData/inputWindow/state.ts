import { FlagsObject, InputWindowState } from "./types";

export const defaultFlags: FlagsObject = {
    defaultImplementation: true,
    notDefaultImplementation: false
}

export const defaultState = (): InputWindowState => {
    return {
        inputWindowData: {
            initValue: 0,
            coordName: '',
            dispachAfterConfirm: 'void',
        },
        processingValue: '0',
        finalValue: 0,
        keyboardFlag: true,
        valcoderStep: 1,
        flags: defaultFlags,
        rejectPointClick: false
    }
}

export const state = defaultState();