export interface FileData {
    fileId: number,
    name: string,
    size: number,
    date: string,
    isActive: boolean
}

export interface FileBrowseWindowState {
    fileList: Array<FileData>
}