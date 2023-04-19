import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { ProfilesWindowState } from "./types";
import { PrintingDiapason } from "../../profiles/types";
import { FileData } from "../../files/types";
import { printingDiapasonProcessor } from "../../profiles/helpers";
import { deepCopyOfMap } from "../../files/helpers";
import { defaultState } from "./state";


export const actions: ActionTree<ProfilesWindowState, RootState> = {
    reset({ commit, state }) {
        Object.assign(state, defaultState())
        commit('reset')
    },

    setFile({ commit, dispatch, rootGetters, state }, payload: FileData) {
        commit('setFile', payload)

        const profiles = state.file?.profiles
        const selectedDiapason = profiles?.selectedDiapason
        if (selectedDiapason) {
            commit('setSelectedDiapason', selectedDiapason)

            let header = state.file?.name
            if (!header) {
                header = 'Профиль печати'
            }

            commit('setHeaderText', header)
            state.lastPrintingProfileFlag = false
        } else {
            dispatch('setLastPrintingInterval')
        }
    },

    initWithGlobalProfiles({ commit, dispatch, rootGetters, state }) {
        const profilesMap: Map<string, PrintingDiapason> = rootGetters['ourExtension/profiles/getDefaultProfilesMap']
        const mapCopy = deepCopyOfMap(profilesMap)
        state.globalProfilesInitialisationFlag = true
        state.globalProfilesMap = mapCopy

        const lastPrintingDiapason: PrintingDiapason = {
            isRootDiapason: true,
            profile: rootGetters['ourExtension/profiles/getLastPrintingProfile']()
        }
        state.lastPrintingProfileFlag = true
        state.globalLastPrintingDiapason = lastPrintingDiapason
        commit('setSelectedDiapason', lastPrintingDiapason)
        // commit('setHeaderText', 'Последняя печать')
    },

    setLastPrintingInterval({ commit, rootGetters, state }) {
        if (!state.globalProfilesInitialisationFlag) {  // Поведение при инициализации файлом
            state.lastPrintingProfileFlag = true
            if (state.file && state.file.profiles) {
                state.file.profiles.selectedDiapason = null
            }
            const lastPrintingDiapason: PrintingDiapason = {
                isRootDiapason: true,
                profile: rootGetters['ourExtension/profiles/getLastPrintingProfile']()
            }
            commit('setSelectedDiapason', lastPrintingDiapason)
            commit('setHeaderText', 'Последняя печать')
        } else {  // Поведение при инициализации глобальными профилями
            state.lastPrintingProfileFlag = true
            state.selectedDiapason = state.globalLastPrintingDiapason
            commit('setHeaderText', 'Последняя печать')
        }

    },

    addDiapason({ commit, state }, payload) {
        const selectedDiapason = state.selectedDiapason;
        if (selectedDiapason) {
            printingDiapasonProcessor.createNext(selectedDiapason)
            if (selectedDiapason.nextDiapason) {
                selectedDiapason.nextDiapason.firstLayer = payload.firstLayer
                selectedDiapason.nextDiapason.lastLayer = payload.lastLayer
                commit('setSelectedDiapason', selectedDiapason.nextDiapason)
            }
        }
    },

    prevDiapason({ commit, state }) {
        const prevDiapason = state.selectedDiapason?.prevDiapason
        if (prevDiapason) {
            commit('setSelectedDiapason', prevDiapason)
        }
    },

    nextDiapason({ commit, state }) {
        const nextDiapason = state.selectedDiapason?.nextDiapason
        if (nextDiapason) {
            commit('setSelectedDiapason', nextDiapason)
        }
    },

    deleteCurrent({ commit, state }) {
        const selectedDiapason = state.selectedDiapason;
        if (selectedDiapason) {
            const newDiapason = printingDiapasonProcessor.deleteCurrent(selectedDiapason);
            commit('setSelectedDiapason', newDiapason)
        }
    },

    deleteAll({ commit, state }) {
        const selectedDiapason = state.selectedDiapason;
        if (selectedDiapason) {
            const newDiapason = printingDiapasonProcessor.deleteAll(selectedDiapason);
            commit('setSelectedDiapason', newDiapason)
        }

    },

    refreshToDefault({ commit, rootGetters, state }) {
        const profileName = state.selectedDiapason?.profile.name
        const defaultMap: Map<string, PrintingDiapason> = rootGetters['ourExtension/profiles/getDefaultProfilesMap']
        if (profileName) {
            let requiredProfile = defaultMap.get(profileName)?.profile
            requiredProfile = JSON.parse(JSON.stringify(requiredProfile))
            if (requiredProfile && state.selectedDiapason) {
                state.selectedDiapason.profile = requiredProfile;
            }
        }
    },

    setProfile({ commit, dispatch, state }, payload: string) {
        if (!state.globalProfilesInitialisationFlag) {  // Поведение при инициализации файлом

            if (payload === 'Последняя печать') {
                if (state.lastPrintingProfileFlag) {
                    return
                } else {
                    dispatch('setLastPrintingInterval')
                }
            } else {
                const newRootDiapason = state.file?.profiles?.profiles.get(payload)
                if (newRootDiapason) {

                    let header = state.file?.name
                    if (!header) {
                        header = 'Профиль печати'
                    }
                    commit('setHeaderText', header)


                    state.lastPrintingProfileFlag = false
                    commit('setSelectedDiapason', newRootDiapason)
                }
            }
        } else {  // Поведение при инициализации глобальными профилями
            if (payload === 'Последняя печать') {
                if (state.lastPrintingProfileFlag) {
                    return
                } else {
                    dispatch('setLastPrintingInterval')
                }
            } else {
                const newRootDiapason = state.globalProfilesMap?.get(payload)
                commit('setHeaderText', 'Профиль печати')
                state.lastPrintingProfileFlag = false
                commit('setSelectedDiapason', newRootDiapason)
            }
        }
    },


    confirm({ state, commit, dispatch }) {
        if (!state.globalProfilesInitialisationFlag) {  // Поведение при инициализации файлом
        } else {
            const map = state.globalProfilesMap
            const values = map?.values()
            if (values) {
                const newProfiles = []
                for (const diapason of values) {
                    newProfiles.push(diapason.profile)
                }
                commit('ourExtension/profiles/setProfiles', newProfiles, { root: true })
                commit('ourExtension/profiles/setLastPrintingProfile', state.globalLastPrintingDiapason?.profile, { root: true })
            }
            dispatch('ourExtension/windowFlags/openPreviousWindow', null, { root: true })
        }
    }
}