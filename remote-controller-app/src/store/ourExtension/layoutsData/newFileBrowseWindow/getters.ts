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
    },

    getUsualSelectedFile(state) {
        for (const file of state.fileList) {
            if (file.isSelected) {
                return file
            }
        }
        return null
    },

    getUsualSelectedDirectory(state) {
        for (const dir of state.directoryList) {
            if (dir.isSelected) {
                return dir
            }
        }
        return null
    }
}