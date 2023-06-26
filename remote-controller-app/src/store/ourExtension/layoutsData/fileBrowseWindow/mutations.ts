import { FileBrowserEntry } from "@/store/files/types";
import { parseUnixDate } from "./helpers";
import { DirectoryData, FileBrowseWindowState, FileData } from "./types";

export default {
    chooseFile(state: FileBrowseWindowState, requiredFileId: number) {
        const requiredFlag = !state.fileList[requiredFileId].isActive;
        for (const item of state.fileList) {
            if (item.fileId === requiredFileId) {
                item.isActive = requiredFlag;
            } else {
                item.isActive = false;
            }
        }
    },

    deactivateFiles(state: FileBrowseWindowState) {
        for (const item of state.fileList) {
            item.isActive = false;
        }
    },

    setFiles(state: FileBrowseWindowState, payload: {items: FileBrowserEntry[], path: string}) {
        state.fileList = [];
        state.directoryList = [];
        state.currentPath = payload.path;
        let filesCounter = 0;
        let directoriesCounter = 0;
        for (const file of payload.items) {
            if (!file.name || file.name == "..") {
                continue;
            }
            const parsedDate = parseUnixDate(file.modified);
            if (file.type === "directory") {
                const directoryData: DirectoryData = {
                    directoryId: directoriesCounter,
                    name: file.name,
                    date: parsedDate,
                    size: Math.round(file.size / 1000),
                }
                state.directoryList.push(directoryData);
                ++directoriesCounter;
            } else {
                const fileData: FileData = {
                    fileId: filesCounter,
                    name: file.name,
                    date: parsedDate,
                    size: Math.round(file.size / 1000),
                    isActive: false
                }
                state.fileList.push(fileData);
                ++filesCounter;
            }
        }
    }
}