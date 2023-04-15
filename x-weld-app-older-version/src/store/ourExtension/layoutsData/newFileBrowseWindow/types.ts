import { DirectoryData, FileData } from "../../files/types"

export interface NewFileBrowseWindowState {
    currentPath: string,
    fileList: FileData[]
    directoryList: DirectoryData[]
    selectedFile: SelectedFileData | null
}

export interface SelectedFileData {
    fileData: FileData
    pathForMoonraker: string
}