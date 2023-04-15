import { FileBrowseWindowState } from "./types";

export default {
    getListOfFiles(state: FileBrowseWindowState) {
        return state.fileList;
    },

    getListOfDirectories(state: FileBrowseWindowState) {
        return state.directoryList;
    },

    getCurrentPath(state: FileBrowseWindowState) {
        return state.currentPath.slice(7)
    }
}