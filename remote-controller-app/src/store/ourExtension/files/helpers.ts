import { DirectoryData, FileData, FileSystem, GcodePrintingProfiles } from "./types";

export const splitPath = (path: string): string[] => {
    let newPath = path;
    if (path.startsWith('/')) {
        newPath = newPath.slice(1);
    }

    if (path.endsWith('/')) {
        newPath = newPath.slice(0, -1);
    }

    return newPath.split('/')
}


export const isDirectoryExistInState = (dirs: DirectoryData[], pathParts: string[]): boolean => {
    if (pathParts.length == 0) {
        return true
    }

    for (const existDirectory of dirs) {
        if (existDirectory.name == pathParts[0]) {
            return isDirectoryExistInState(existDirectory.dirs, pathParts.slice(1))
        }
    }

    return false
}

export const tryToCreateDirectoryInState = (dirs: DirectoryData[], pathParts: string[], payload: any): string[] => {
    if (pathParts.length == 1) {
        dirs.push({
            dirs: createDirectoriesList(payload),
            files: createFilesList(payload),
            modified: "--.--.----",
            name: pathParts[0],
            permissions: "?",
            sizeInKb: "?",
            computedSize: "?kb",
            isSelected: false
        })
        return getAnotherDirsNames(payload)
    }

    for (const existDirectory of dirs) {
        if (existDirectory.name == pathParts[0]) {
            return tryToCreateDirectoryInState(existDirectory.dirs, pathParts.slice(1), payload)
        }
    }

    return []
}

function createFilesList(payload: any): FileData[] {
    const filesList: FileData[] = []
    if (payload.files || payload.files.length) {
        for (const file of payload.files) {
            filesList.push({
                name: file.filename,
                modified: toHumanDate(file.modified),
                permissions: file.permissions,
                sizeInKb: toSizeInKb(file.size),
                size: file.size,
                computedSize: resolveComputedSize(file.size),
                layers: "?",
                isSelected: false,
                printingTime: "?h ?m",
                pathForMoonraker: getPathForMoonraker(payload.__request__.params.path, file.filename),
                dirnameForMoonraker: getDirNameForMoonraker(payload.__request__.params.path)
            })
        }
    }
    return filesList;
}

function createDirectoriesList(payload: any): DirectoryData[] {
    const directoriesList: DirectoryData[] = []
    if (payload.dirs || payload.dirs.length) {
        for (const dir of payload.dirs) {
            directoriesList.push({
                dirs: [],
                files: [],
                name: dir.dirname,
                modified: toHumanDate(dir.modified),
                permissions: dir.permissions,
                sizeInKb: toSizeInKb(dir.size),
                computedSize: resolveComputedSize(dir.size),
                isSelected: false
            })
        }
    }
    return directoriesList;
}

export const tryToInsertDirectoryInfoToState = (dirs: DirectoryData[], pathParts: string[], payload: any): string[] => {
    if (pathParts.length == 1) {
        for (const existDirectory of dirs) {
            if (existDirectory.name == pathParts[0]) {
                existDirectory.files = createFilesList(payload)
                existDirectory.dirs = createDirectoriesList(payload)
                return getAnotherDirsNames(payload)
            }
        }
        return []
    }

    for (const existDirectory of dirs) {
        if (existDirectory.name == pathParts[0]) {
            return tryToInsertDirectoryInfoToState(existDirectory.dirs, pathParts.slice(1), payload)
        }
    }

    return []
}

function getAnotherDirsNames(payload: any): string[] {
    const anotherDirs = []
    if (payload.dirs && payload.dirs.length) {
        for (const dir of payload.dirs) {
            if (dir.dirname) {
                anotherDirs.push(dir.dirname)
            }
        }
    }
    return anotherDirs
}

function toHumanDate(unixTime: number): string {
    if (typeof unixTime === "undefined") return "--.--.----"
    const date = new Date(unixTime * 1000);
    let day = date.getDate().toString();
    let month = date.getMonth() + 1 + "";
    if (day.length === 1) {
        day = "0" + day;
    }

    if (month.length === 1) {
        month = "0" + month;
    }
    return `${day}.${month}.${date.getFullYear()}`;
}

function toSizeInKb(sizeInBytes: number): string {
    if (typeof sizeInBytes === "undefined" || typeof sizeInBytes !== "number") return "?"
    return Math.round(sizeInBytes / 1000) + ''
}

export const getDirectoryByPath = (dirs: DirectoryData[], pathParts: string[]): DirectoryData => {
    if (pathParts.length == 1) {
        for (const existDirectory of dirs) {
            if (existDirectory.name == pathParts[0]) {
                return existDirectory
            }
        }
        dirs.push(createDirectory(pathParts[0]))
        return dirs[dirs.length - 1]
    }

    for (const existDirectory of dirs) {
        if (existDirectory.name == pathParts[0]) {
            return getDirectoryByPath(existDirectory.dirs, pathParts.slice(1))
        }
    }
    dirs.push(createDirectory(pathParts[0]))

    return getDirectoryByPath(dirs[dirs.length - 1].dirs, pathParts.slice(1))
}

function createDirectory(name: string): DirectoryData {
    return {
        dirs: [],
        files: [],
        modified: '--:--:----',
        name: name,
        permissions: "?",
        sizeInKb: "?",
        computedSize: "?kb",
        isSelected: false
    }
}

export const getPathForMoonraker = (fullDirPath: string, filename: string): string => {
    if (fullDirPath.startsWith('gcodes/')) {
        return fullDirPath.slice(7) + '/' + filename;
    }
    if (fullDirPath === "gcodes") {
        return filename;
    }
    const firstSlashIndex = fullDirPath.indexOf("/")
    if (firstSlashIndex !== -1) {
        return fullDirPath.slice(firstSlashIndex + 1) + '/' + filename;
    } else {
        return filename;
    }
}

export const getDirNameForMoonraker = (fullDirPath: string): string => {
    if (fullDirPath.startsWith('gcodes/')) {
        return fullDirPath.slice(7);
    }
    if (fullDirPath === "gcodes") {
        return "";
    }
    const firstSlashIndex = fullDirPath.indexOf("/")
    if (firstSlashIndex !== -1) {
        return fullDirPath.slice(firstSlashIndex + 1);
    } else {
        return '';
    }
}


export const createFilesMap = (fileSystem: FileSystem, dirs: DirectoryData[]) => {

    for (const dir of dirs) {
        switch (dir.name) {
            case 'gcodes':
                createMap(fileSystem.gcodes, dir)
                break;
            case 'config':
                if (fileSystem.config) {
                    createMap(fileSystem.config, dir)
                }
                break;
            default:
                break;
        }
    }

}

function createMap(filesMap: Map<string, FileData>, currentDir: DirectoryData) {
    for (const file of currentDir.files) {
        filesMap.set(file.pathForMoonraker, file)
    }

    for (const dir of currentDir.dirs) {
        createMap(filesMap, dir)
    }
}

export const handleFileCreation = (dirs: DirectoryData[], payload: any) => {
    if (selectedDiapasonCheck(payload)) return
    // console.log(payload)
    const path = splitPath(payload.item.path)
    path.unshift(payload.item.root)
    const filename = path[path.length - 1]
    const requiredDirectory = getDirectoryByPath(dirs, path.slice(0, path.length - 1))
    // console.log(path.slice(0, path.length - 1).join('/'))
    requiredDirectory?.files.push({
        dirnameForMoonraker: getDirNameForMoonraker(path.slice(0, path.length - 1).join('/')),
        isSelected: false,
        layers: "?",
        modified: toHumanDate(payload.item.modified),
        name: filename,
        pathForMoonraker: getPathForMoonraker(path.slice(0, path.length - 1).join('/'), filename),
        permissions: payload.item.permissions,
        printingTime: "?h ?m",
        size: payload.item.size,
        sizeInKb: toSizeInKb(payload.item.size),
        computedSize: resolveComputedSize(payload.item.size)
    })

}

function selectedDiapasonCheck(payload: any): boolean {
    if (payload.item.root === 'config' && payload.item.path === 'profiles/selected_diapason.json') return true
    return false
}

export const handleFileDeletion = (dirs: DirectoryData[], payload: any) => {
    const path = splitPath(payload.item.path)
    path.unshift(payload.item.root)
    const requiredDirectory = getDirectoryByPath(dirs, path.slice(0, path.length - 1))
    const filename = path[path.length - 1]

    if (requiredDirectory) {
        let index = 0;
        for (const file of requiredDirectory.files) {
            if (file.name === filename) {
                requiredDirectory.files.splice(index, 1);
                break;
            }
            index++;
        }
    }
}

export const handleFileModifying = (dirs: DirectoryData[], payload: any) => {
    const path = splitPath(payload.item.path)
    path.unshift(payload.item.root)
    const requiredDirectory = getDirectoryByPath(dirs, path.slice(0, path.length - 1))
    const filename = path[path.length - 1]

    if (requiredDirectory) {
        let index = 0;
        for (const file of requiredDirectory.files) {
            if (file.name === filename) {
                file.modified = toHumanDate(payload.item.modified)
                file.permissions = payload.item.permissions
                file.sizeInKb = toSizeInKb(payload.item.size)
                file.size = payload.item.size
                break;
            }
            index++;
        }
    }
}

export const handleFileMove = (dirs: DirectoryData[], payload: any) => {
    const sourceMoonrakerPath = payload.source_item.path
    const sourcePathParts = splitPath(sourceMoonrakerPath);
    sourcePathParts.unshift(payload.source_item.root)
    const fileData = popFile(dirs, sourcePathParts);
    if (fileData) {
        const targetMoonrakerPath = payload.item.path
        const targetPathParts = splitPath(targetMoonrakerPath);
        targetPathParts.unshift(payload.item.root)
        const targetFilename = targetPathParts[targetPathParts.length - 1]


        fileData.modified = toHumanDate(payload.item.modified)
        fileData.name = targetFilename
        fileData.pathForMoonraker = payload.item.path
        fileData.dirnameForMoonraker = getDirNameForMoonraker(targetPathParts.slice(0, targetPathParts.length - 1).join('/'))
        fileData.isSelected = false;

        pushFile(dirs, targetPathParts, fileData)
    }

}

function popFile(dirs: DirectoryData[], fullPathParts: string[]): FileData | null {
    const sourceDir = fullPathParts.slice(0, fullPathParts.length - 1)
    const sourceFilename = fullPathParts[fullPathParts.length - 1]
    const requiredDirectory = getDirectoryByPath(dirs, sourceDir);
    if (requiredDirectory) {
        let index = 0;
        for (const file of requiredDirectory.files) {
            if (file.name === sourceFilename) {
                requiredDirectory.files.splice(index, 1);
                return file;
            }
            index++;
        }
    }
    return null;
}

function pushFile(dirs: DirectoryData[], fullPathParts: string[], fileData: FileData) {
    const sourceDir = fullPathParts.slice(0, fullPathParts.length - 1)
    const requiredDirectory = getDirectoryByPath(dirs, sourceDir);
    requiredDirectory?.files.push(fileData)
}

export const handleDirectoryCreation = (dirs: DirectoryData[], payload: any) => {
    const sourceMoonrakerPath = payload.item.path
    const sourcePathParts = splitPath(sourceMoonrakerPath);
    sourcePathParts.unshift(payload.item.root)
    const newDirectory = getDirectoryByPath(dirs, sourcePathParts);
    if (newDirectory) {
        newDirectory.modified = toHumanDate(payload.item.modified)
        newDirectory.permissions = payload.item.permissions
        newDirectory.sizeInKb = toSizeInKb(payload.item.size)
    }
}


export const refreshDirectoriesSize = (dirs: DirectoryData[]) => {
    for (const dir of dirs) {
        getDirectorySize(dir)
    }
}

function getDirectorySize(directory: DirectoryData): number {
    let size = 0;
    for (const file of directory.files) {
        const fileSize = +file.sizeInKb;
        if (!isNaN(fileSize)) {
            size += +file.sizeInKb
        }
    }

    for (const dir of directory.dirs) {
        const dirSize = getDirectorySize(dir);
        size += +dirSize;
    }
    directory.sizeInKb = size + '';
    directory.computedSize = resolveComputedSize(size * 1000)
    return +size;
}

export const handleDirectoryDeletion = (dirs: DirectoryData[], payload: any) => {
    const sourceMoonrakerPath = payload.item.path
    const sourcePathParts = splitPath(sourceMoonrakerPath);
    sourcePathParts.unshift(payload.item.root)
    const sourceDirname = sourcePathParts[sourcePathParts.length - 1]

    const parentDirectoryPathParts = sourcePathParts.slice(0, sourcePathParts.length - 1)
    const parentDirectory = getDirectoryByPath(dirs, parentDirectoryPathParts)
    if (parentDirectory) {
        let index = 0;
        for (const dir of parentDirectory.dirs) {
            if (dir.name === sourceDirname) {
                parentDirectory.dirs.splice(index, 1);
                break;
            }
            index++;
        }
    }

}

function resolveComputedSize(size: number) {
    if (isNaN(parseInt(size + ''))) {
        return '?'
    }

    let sizeInKb = Math.round(size / 1000);
    if (sizeInKb < 1000) {
        return sizeInKb + 'kb'
    }

    let sizeInMb = mathToFixed(sizeInKb / 1000);
    if (sizeInMb < 1000) {
        return sizeInMb + 'MB'
    }

    let sizeInGb = mathToFixed(sizeInMb / 1000);
    return sizeInGb + 'GB'
}

function mathToFixed(needToFixed: number) {
    return Math.round(needToFixed * 10) / 10;
}

export const handleDirectoryMove = (dirs: DirectoryData[], payload: any) => {
    const sourceMoonrakerPath = payload.source_item.path
    const sourcePathParts = splitPath(sourceMoonrakerPath);
    sourcePathParts.unshift(payload.source_item.root)
    const directoryData = popDirectory(dirs, sourcePathParts);
    if (directoryData) {
        const targetMoonrakerPath = payload.item.path
        const targetPathParts = splitPath(targetMoonrakerPath);
        targetPathParts.unshift(payload.item.root)
        const targetDirname = targetPathParts[targetPathParts.length - 1]


        directoryData.modified = toHumanDate(payload.item.modified)
        directoryData.name = targetDirname

        pushDirectory(dirs, targetPathParts, directoryData)
    }
}

function popDirectory(dirs: DirectoryData[], fullPathParts: string[]): DirectoryData | null {
    const sourceDir = fullPathParts.slice(0, fullPathParts.length - 1)
    const sourceDirname = fullPathParts[fullPathParts.length - 1]
    const requiredDirectory = getDirectoryByPath(dirs, sourceDir);
    if (requiredDirectory) {
        let index = 0;
        for (const dir of requiredDirectory.dirs) {
            if (dir.name === sourceDirname) {
                requiredDirectory.dirs.splice(index, 1);
                return dir;
            }
            index++;
        }
    }
    return null;
}

function pushDirectory(dirs: DirectoryData[], fullPathParts: string[], directoryData: DirectoryData) {
    const sourceDir = fullPathParts.slice(0, fullPathParts.length - 1)
    const requiredDirectory = getDirectoryByPath(dirs, sourceDir);
    requiredDirectory?.dirs.push(directoryData)
}

export const refreshMoonrakerPaths = (dirs: DirectoryData[], path = '') => {
    for (const dir of dirs) {
        const prefix = resolvePrefix(dir.name, path)
        for (const file of dir.files) {
            file.pathForMoonraker = prefix + file.name;
            file.dirnameForMoonraker = prefix.slice(0, -1);
        }
        if (dir.dirs.length !== 0) {
            refreshMoonrakerPaths(dir.dirs, prefix)
        }
    }
}

function resolvePrefix(dirname: string, path: string) {
    if (['config', 'gcodes'].includes(dirname)) return path;
    if (path) {
        return path + dirname + '/';
    }
    return dirname + '/';
}

export const deepCopyOfMap = <T, V>(map: Map<T, V>): Map<T, V> => {
    return new Map(JSON.parse(JSON.stringify(Array.from(map))))
}

export const setProfilesForNewFiles = (dirs: DirectoryData[], gCodePrintingProfiles: GcodePrintingProfiles) => {
    const gCodesDir = getDirectoryByPath(dirs, ['gcodes'])
    recursiveSetProfiles(gCodesDir, gCodePrintingProfiles)
}

function recursiveSetProfiles(dir: DirectoryData, gCodePrintingProfiles: GcodePrintingProfiles) {
    // const lastSelectedDiapason = gCodePrintingProfiles.lastSelectedDiapason;
    const profilesMap = gCodePrintingProfiles.profiles;
    for (const file of dir.files) {
        if (!file.profiles) {
            file.profiles = {
                // lastSelectedDiapason: JSON.parse(JSON.stringify(lastSelectedDiapason)),
                profiles: deepCopyOfMap(profilesMap)
            }
        }
    }
    for (const childDir of dir.dirs) {
        recursiveSetProfiles(childDir, gCodePrintingProfiles)
    }
}