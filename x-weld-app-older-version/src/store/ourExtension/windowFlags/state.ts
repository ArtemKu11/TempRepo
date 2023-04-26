import { FlagsObject, WindowFlagsState } from "./types";

export const initWindowFlags: FlagsObject = {
    mainWindowFlag: true,
    fileBrowseWindowFlag: false,
    filePreviewWindowFlag: false,
    moveWindowFlag: false,
    inputWindowFlag: false,
    mainSettingsWindowFlag: false,
    consoleWindowFlag: false,
    profilesWindowFlag: false,
    selectListWindowFlag: false,
    preprintingWindowFlag: false,
    printingWindowFlag: false,
    printSettingsFlag: false,
    gorelkaMaintenanceWindowFlag: false,
    systemInfoWindow: false
}

export const windowFlagsState = (): WindowFlagsState => {
    return {
        stack: [initWindowFlags],
        flags: JSON.parse(JSON.stringify(initWindowFlags))
    }
}

export const state = windowFlagsState();