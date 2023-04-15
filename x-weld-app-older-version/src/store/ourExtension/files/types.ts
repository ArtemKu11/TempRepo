export interface LightFilesState {
    files: FileData[]
    dirs: DirectoryData[],
    recursiveFlag: number[] // must be empty, when recursive process is finished
    fileSystem: FileSystem
    isLoadingFinish: boolean
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
}

export interface FileSystem {
    gcodes: Map<string, FileData>,
    config?: Map<string, FileData>
}