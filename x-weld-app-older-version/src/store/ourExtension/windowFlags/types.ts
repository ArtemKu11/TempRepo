export interface FlagsObject {
    mainWindowFlag: boolean,
    fileBrowseWindowFlag: boolean,
    filePreviewWindowFlag: boolean
}

export interface WindowFlagsState {
    stack: Array<FlagsObject>
    flags: FlagsObject
}