import { SocketActions } from "@/api/socketActions";
import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { getSortedMapKeys } from "../profiles/helpers";
import { PrintingDiapason } from "../profiles/types";
import { createFilesMap, deepCopyOfMap, handleDirectoryCreation, handleDirectoryDeletion, handleDirectoryMove, handleFileCreation, handleFileDeletion, handleFileModifying, handleFileMove, isDirectoryExistInState as isDirectoryExistInState, refreshDirectoriesSize, refreshMoonrakerPaths, setProfilesForNewFiles, splitPath, tryToCreateDirectoryInState, tryToInsertDirectoryInfoToState } from "./helpers";
import { GcodePrintingProfiles, LightFilesState } from "./types";

export const actions: ActionTree<LightFilesState, RootState> = {
    getAllFilesAndDirs({ state }, directory: string) {
        state.isLoadingFinish = false;
        state.recursiveFlag.push(1)
        const pathParts = splitPath(directory);
        SocketActions.serverGetAllFilesAndDirs(directory, pathParts[0])
    },

    onGetAllFilesAndDirs({ dispatch, state }, payload) {
        const path = payload.__request__.params.path
        if (path) {
            const pathParts = splitPath(path);
            let anotherDirs = []
            if (!isDirectoryExistInState(state.dirs, pathParts)) {
                anotherDirs = tryToCreateDirectoryInState(state.dirs, pathParts, payload)
            } else {
                anotherDirs = tryToInsertDirectoryInfoToState(state.dirs, pathParts, payload)
            }

            if (anotherDirs.length > 0) {
                for (const dirName of anotherDirs) {
                    if (dirName) {
                        dispatch('getAllFilesAndDirs', `${path}/${dirName}`)
                    }
                }
            }
        }
        state.recursiveFlag.pop()
        if (state.recursiveFlag.length == 0) {
            dispatch('ourExtension/layoutsData/newFileBrowseWindow/refresh', null, { root: true })
            dispatch('createFilesMap')
            dispatch('refreshDirectoriesSize')
            state.isLoadingFinish = true;
            state.isProfilesDownloadingFinished = true;
            dispatch('setPrintingProfilesForNewFiles')  // Не выполняется при первой загрузке
        }
    },

    createFilesMap({ state }) {
        refreshMoonrakerPaths(state.dirs);

        state.fileSystem.gcodes.clear()
        state.fileSystem.config?.clear()
        createFilesMap(state.fileSystem, state.dirs)
    },

    setLayersByMoonrakerPath({ commit, dispatch }, payload) {
        commit('setLayersByMoonrakerPath', payload)
    },

    refreshDirectoriesSize({ state }) {
        refreshDirectoriesSize(state.dirs)
    },

    refreshGcodeParser({ commit, dispatch, state }) {
        refreshMoonrakerPaths(state.dirs);
        dispatch('createFilesMap');
        commit('refreshGcodeParser');
    },

    onFileListChanged({ state, dispatch, commit }, payload) {
        switch (payload.action) {
            case "create_file":
                handleFileCreation(state.dirs, payload)
                if (payload.item.root === "gcodes") {
                    commit('refreshGcodeParser')
                    dispatch('setPrintingProfilesForNewFiles')
                }
                break;
            case "delete_file":
                handleFileDeletion(state.dirs, payload)
                if (payload.item.root === "gcodes") {
                    commit('refreshGcodeParser')
                }
                break;
            case "modify_file":
                handleFileModifying(state.dirs, payload)
                if (payload.item.root === "gcodes") {
                    commit('refreshGcodeParser')
                }
                break;
            case "move_file":
                handleFileMove(state.dirs, payload)
                if (payload.item.root === "gcodes") {
                    commit('refreshGcodeParser')
                }
                break;
            case "create_dir":
                handleDirectoryCreation(state.dirs, payload)
                state.recursiveFlag = []
                dispatch('getAllFilesAndDirs', payload.item.root + '/' + payload.item.path)
                break;
            case "delete_dir":
                handleDirectoryDeletion(state.dirs, payload)
                break;
            case "move_dir":
                handleDirectoryMove(state.dirs, payload);
                refreshMoonrakerPaths(state.dirs)
                if (payload.item.root === "gcodes") {
                    commit('refreshGcodeParser')
                }
                break;
        }
        dispatch('createFilesMap');
        dispatch('refreshDirectoriesSize')
    },

    setProfilesForAllGcodes({ state, rootGetters }, payload: Map<string, PrintingDiapason>) {
        for (const file of state.fileSystem.gcodes.values()) {
            const profilesMap: Map<string, PrintingDiapason> = deepCopyOfMap(payload);
            // const lastSelectedDiapason: PrintingDiapason = {
            //     isRootDiapason: true,
            //     profile: rootGetters['ourExtension/profiles/getLastPrintingProfile']
            // }
            const gCodePrintingProfiles: GcodePrintingProfiles = {
                // lastSelectedDiapason: lastSelectedDiapason,
                profiles: profilesMap
            }
            file.profiles = gCodePrintingProfiles
        }
        state.isProfiesSetupFinished = true;
    },

    setPrintingProfilesForNewFiles({ state, rootGetters }) {
        if (state.isProfiesSetupFinished) {
            const profilesMap = rootGetters['ourExtension/profiles/getDefaultProfilesMap']
            const profilesMapCopy: Map<string, PrintingDiapason> = deepCopyOfMap(profilesMap);
            // const lastSelectedDiapason: PrintingDiapason = {
            //     isRootDiapason: true,
            //     profile: rootGetters['ourExtension/profiles/getLastPrintingProfile']
            // }
            const gCodePrintingProfiles: GcodePrintingProfiles = {
                // lastSelectedDiapason: lastSelectedDiapason,
                profiles: profilesMapCopy
            }
            setProfilesForNewFiles(state.dirs, gCodePrintingProfiles);
        }
    }
}