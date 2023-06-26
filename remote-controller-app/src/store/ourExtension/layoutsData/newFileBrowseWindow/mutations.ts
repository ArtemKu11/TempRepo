import { MutationTree } from "vuex";
import { getPathForMoonraker } from "../../files/helpers";
import { DirectoryData, FileData } from "../../files/types";
import { NewFileBrowseWindowState, SelectedFileData } from "./types";

export const mutations: MutationTree<NewFileBrowseWindowState> =  {
    setCurrentPath(state, newPath: string) {
        state.currentPath = newPath;
    },

    setFilesAndDirs(state, directoryData: DirectoryData) {
        state.directoryList = directoryData.dirs;
        state.fileList = directoryData.files;
    },

    deactivateFiles(state) {
        for (const file of state.fileList) {
            file.isSelected = false;
        }

        for (const dir of state.directoryList) {
            dir.isSelected = false
        }
    },

    setSelectedFile(state, fileData: FileData | null) {
        if (fileData) {
            const selectedFileData: SelectedFileData = {
                fileData: fileData,
                pathForMoonraker: getPathForMoonraker(state.currentPath, fileData.name)
            }
            state.selectedFile = selectedFileData;

        } else {
            state.selectedFile = null;
        }
        
    }
}