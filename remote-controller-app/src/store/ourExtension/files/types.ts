import { PrintingDiapason, PrintingDiapasonForMoonraker } from "../profiles/types"

export interface LightFilesState {
    files: FileData[]
    dirs: DirectoryData[],
    recursiveFlag: number[] // must be empty, when recursive process is finished
    fileSystem: FileSystem
    isLoadingFinish: boolean
    isProfilesDownloadingFinished: boolean
    isProfiesSetupFinished: boolean
    selectedFile: FileData | null
}

export interface DirectoryData {
    name: string,
    modified: string,
    permissions: string,
    sizeInKb: string
    computedSize: string
    files: FileData[]
    dirs: DirectoryData[]
    isSelected: boolean
}

export interface FileData {
    name: string,
    modified: string,  // Если undefined, то будет --.--.----
    permissions: string,  // Обычно rw
    sizeInKb: string,  // Либо чисто строкой без "kb", либо "?"
    size: number,  // Размер в байтах, приходит с сервера
    computedSize: string  // Либо "?", либо "nkb", "nMB", "nGB"
    layers: string,  // Либо число строкой, либо "?"
    printingTime: string,  // Либо "?h ?m", либо числа заместо "?"
    isSelected: boolean,  // По умолчанию false. Сетается в true в экране выбора фалов
    pathForMoonraker: string,  // Путь до файла, включая имя файла, но без рут-директории (gcodes, config и т.д.). Если файл в корне рут-директории, то просто filename
    dirnameForMoonraker: string,  // Путь до файла, НЕ включая имя файла, но без рут-директории (gcodes, config и т.д.). Если файл в корне рут-директории, то пустая строка
    profiles?: GcodePrintingProfiles  // Не сетаются при загрузке файлов
}

export interface FileSystem {
    gcodes: Map<string, FileData>,
    config?: Map<string, FileData>
}

export interface GcodePrintingProfiles {
    selectedDiapason?: PrintingDiapason | null,
    profiles: Map<string, PrintingDiapason>
}

export interface LastPrintingFile {
    file: FileData,
    diapason: PrintingDiapasonForMoonraker
}
