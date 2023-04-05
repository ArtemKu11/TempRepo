import { FileBrowseWindowState } from "./types";

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
    }
}