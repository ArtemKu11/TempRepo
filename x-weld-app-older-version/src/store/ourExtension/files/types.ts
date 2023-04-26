import { PrintingDiapason, PrintingDiapasonForMoonraker } from "../profiles/types"

export interface LightFilesState {
    files: FileData[]
    dirs: DirectoryData[],
    recursiveFlag: number[] // must be empty, when recursive process is finished
    fileSystem: FileSystem
    isLoadingFinish: boolean
    isProfilesDownloadingFinished: boolean
    isProfiesSetupFinished: boolean
    lastPrintingFile?: LastPrintingFile
}

export interface DirectoryData {
    name: string,
    modified: string,
    permissions: string,
    sizeInKb: string
    computedSize: string
    files: FileData[]
    dirs: DirectoryData[]
}

export interface FileData {
    name: string,
    modified: string,
    permissions: string,
    sizeInKb: string,
    size: number,
    computedSize: string
    layers: string,
    printingTime: string,
    isSelected: boolean,
    pathForMoonraker: string,
    dirnameForMoonraker: string,
    profiles?: GcodePrintingProfiles
}

export interface FileSystem {
    gcodes: Map<string, FileData>,
    config?: Map<string, FileData>
}

export interface GcodePrintingProfiles {
    lastSelectedDiapason?: PrintingDiapason,
    selectedDiapason?: PrintingDiapason | null,
    profiles: Map<string, PrintingDiapason>
}

export interface LastPrintingFile {
    file: FileData,
    diapason: PrintingDiapasonForMoonraker
}
