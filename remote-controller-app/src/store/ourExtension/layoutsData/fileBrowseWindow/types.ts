export interface FileBrowseWindowState {
    currentPath: string
    directoryList: Array<DirectoryData>
    fileList: Array<FileData>
}

export interface FileData {
    fileId: number,
    name: string,
    size: number,
    date: string,
    isActive: boolean
}

export interface DirectoryData {
    directoryId: number,
    name: string,
    size: number,
    date: string,
}
