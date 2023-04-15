import { SocketActions } from "@/api/socketActions";
import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { DirectoryData, FileBrowseWindowState } from "./types";

export const actions: ActionTree<FileBrowseWindowState, RootState> = {
    openDirectory({rootState, getters}, directoryData: DirectoryData) {
        const currentPath = getters['getCurrentPath'];
        if (currentPath) {
            SocketActions.serverGetGcodes(currentPath + "/" + directoryData.name);
        } else {
            SocketActions.serverGetGcodes(directoryData.name);
        }
    },

    openPreviousDirectory({getters}) { 
        let currentPath = getters['getCurrentPath'] as string;
        if (currentPath) {
            const slash = currentPath.lastIndexOf("/");
            if (slash !== -1) {
                currentPath = currentPath.slice(0, slash)
            } else {
                currentPath = ""
            }
            console.log(currentPath)
            SocketActions.serverGetGcodes(currentPath);
        }
    },

    onSetGcodeFiles({ dispatch, commit, rootGetters }, payload) {
        dispatch('files/onServerFilesGetDirectory', payload, {root: true})
        if(!rootGetters['ourExtension/windowFlags/getFileBrowseWindowFlag']) {
            dispatch('ourExtension/windowFlags/onOpenFileBrowseWindow', null, {root: true});
        }
    }
}