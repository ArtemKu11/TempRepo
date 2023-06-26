import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { getDirectoryByPath, isDirectoryExistInState, splitPath } from "./helpers";
import { DirectoryData, FileData, LightFilesState } from "./types";

export const getters: GetterTree<LightFilesState, RootState> = {
    getListOfFilesAndDirs(state) {
        if (state.dirs[0] && state.dirs[0].name === "gcodes") {
            return state.dirs[0]
        } else {
            return []
        }
    },

    getDirs(state) {
        return state.dirs
    },

    getFilesLoadingFinishedFlag: (state) => {
        return state.isLoadingFinish;
    },

    getProfilesDownloadingFinishedFlag: (state) => {
        return state.isProfilesDownloadingFinished;
    },

    getFilesMap(state) {
        return state.fileSystem;
    },

    getProfilesFiles(state): DirectoryData | null {
        if (isDirectoryExistInState(state.dirs, splitPath('config/profiles'))) {
            return getDirectoryByPath(state.dirs, splitPath('config/profiles'))
        }
        return null
    },

    getSelectedFile(state): FileData | null {
        return state.selectedFile
    }
}