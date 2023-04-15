import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { NewFileBrowseWindowState } from "./types";

export const getters: GetterTree<NewFileBrowseWindowState, RootState> = {
    getCurrentPath(state) {
        return state.currentPath
    },

    getFileList(state) {
        return state.fileList;
    },

    getDirectoryList(state) {
        return state.directoryList;
    },

    getSelectedFile(state) {
        return state.selectedFile;
    }
}