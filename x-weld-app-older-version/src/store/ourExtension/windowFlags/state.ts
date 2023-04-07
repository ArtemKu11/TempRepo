import { FlagsObject, WindowFlagsState } from "./types";

export const initWindowFlags: FlagsObject = {
    mainWindowFlag: true,
    fileBrowseWindowFlag: false,
    filePreviewWindowFlag: false
}

export const windowFlagsState = (): WindowFlagsState => {
    return {
        stack: [initWindowFlags],
        flags: JSON.parse(JSON.stringify(initWindowFlags))
    }
}

export const state = windowFlagsState();