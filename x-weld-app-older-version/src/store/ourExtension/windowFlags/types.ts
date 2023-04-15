export interface FlagsObject {
    mainWindowFlag: boolean,
    fileBrowseWindowFlag: boolean,
    filePreviewWindowFlag: boolean,
    moveWindowFlag: boolean,
    inputWindowFlag: boolean
    mainSettingsWindowFlag: boolean
    consoleWindowFlag: boolean
}

export interface WindowFlagsState {
    stack: Array<FlagsObject>
    flags: FlagsObject
}