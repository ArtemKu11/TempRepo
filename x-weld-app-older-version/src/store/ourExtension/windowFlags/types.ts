export interface FlagsObject {
    mainWindowFlag: boolean,
    fileBrowseWindowFlag: boolean,
    filePreviewWindowFlag: boolean,
    moveWindowFlag: boolean,
    inputWindowFlag: boolean
    mainSettingsWindowFlag: boolean
    consoleWindowFlag: boolean
    profilesWindowFlag: boolean
    selectListWindowFlag: boolean
    preprintingWindowFlag: boolean
    printingWindowFlag: boolean
    printSettingsFlag: boolean
    gorelkaMaintenanceWindowFlag: boolean
    systemInfoWindow: boolean
}

export interface WindowFlagsState {
    stack: Array<FlagsObject>
    flags: FlagsObject
}