import { FlagsObject, WindowFlagsState } from "./types";

export const initWindowFlags: FlagsObject = {
    mainWindowFlag: true,
    fileBrowseWindowFlag: false,
    filePreviewWindowFlag: false,
    moveWindowFlag: false,
    inputWindowFlag: false,
    mainSettingsWindowFlag: false,
    consoleWindowFlag: false
}

export const windowFlagsState = (): WindowFlagsState => {
    return {
        stack: [initWindowFlags],
        flags: JSON.parse(JSON.stringify(initWindowFlags))
    }
}

export const state = windowFlagsState();