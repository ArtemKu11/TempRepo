import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { getDirectoryByPath, isDirectoryExistInState, splitPath } from "../../files/helpers";
import { DirectoryData } from "../../files/types";
import { NewFileBrowseWindowState } from "./types";

export const actions: ActionTree<NewFileBrowseWindowState, RootState> = {
    refresh({dispatch, commit, getters}) {
        commit('setSelectedFile', null)
        dispatch('setCurrentPath', getters['getCurrentPath'])
    },

    setCurrentPath({commit, dispatch, rootGetters, getters}, newPath: string) {
        commit('setCurrentPath', newPath)
        const rootDirectoryData: DirectoryData[] = rootGetters['ourExtension/files/getDirs'];
        const pathParts = splitPath(getters['getCurrentPath']);
        if (isDirectoryExistInState(rootDirectoryData, pathParts)) {
            const requiredDirectoryData = getDirectoryByPath(rootDirectoryData, pathParts);
            commit('setFilesAndDirs', requiredDirectoryData)
        }
    }
}