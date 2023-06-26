import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { ProfilesWindowState } from "./types";
import { PrintingDiapason } from "../../profiles/types";
import { FileData } from "../../files/types";
import { printingDiapasonProcessor } from "../../profiles/helpers";
import { deepCopyOfMap } from "../../files/helpers";
import { defaultState } from "./state";
import { InfoAlertType } from "../alerts/types";
import { Alerts } from "../alerts/helpers";


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

            Alerts.profileSelectedAlert(selectedDiapason.profile.name, state.layersText)
        } else {
            dispatch('setLastPrintingInterval')
        }
    },

    setCallback({ state }, payload: Function) {
        state.confirmCallback = payload;
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
        Alerts.lastPrintingProfileSelectedAlert(state.layersText)

        // commit('setHeaderText', 'Последняя печать')
    },

    setLastPrintingInterval({ dispatch, commit, rootGetters, state }) {
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
        Alerts.lastPrintingProfileSelectedAlert(state.layersText)
    },

    addDiapason({ dispatch, commit, state }, payload) {
        const selectedDiapason = state.selectedDiapason;
        if (selectedDiapason) {
            printingDiapasonProcessor.createNext(selectedDiapason)
            if (selectedDiapason.nextDiapason) {
                selectedDiapason.nextDiapason.firstLayer = payload.firstLayer
                selectedDiapason.nextDiapason.lastLayer = payload.lastLayer
                commit('setSelectedDiapason', selectedDiapason.nextDiapason)
                Alerts.addDiapasonAlert(state.layersText)
            }
        }
    },

    prevDiapason({ dispatch, commit, state }) {
        const prevDiapason = state.selectedDiapason?.prevDiapason
        if (prevDiapason) {
            commit('setSelectedDiapason', prevDiapason)

            let text = state.layersText
            if (state.selectedDiapason?.isRootDiapason) {
                text = '(Основной диапазон)'
            }
            Alerts.diapasonSelectedAlert(text)
        }
    },

    nextDiapason({ dispatch, commit, state }) {
        const nextDiapason = state.selectedDiapason?.nextDiapason
        if (nextDiapason) {
            commit('setSelectedDiapason', nextDiapason)

            let text = state.layersText
            if (state.selectedDiapason?.isRootDiapason) {
                text = '(Основной диапазон)'
            }

            Alerts.diapasonSelectedAlert(text)
        }
    },

    deleteCurrent({ dispatch, commit, state }) {
        const selectedDiapason = state.selectedDiapason;
        if (selectedDiapason) {
            const newDiapason = printingDiapasonProcessor.deleteCurrent(selectedDiapason);
            commit('setSelectedDiapason', newDiapason)
            Alerts.deleteDiapasonAlert(selectedDiapason)
        }
    },

    deleteAll({ dispatch, commit, state }) {
        const selectedDiapason = state.selectedDiapason;
        if (selectedDiapason) {
            const newDiapason = printingDiapasonProcessor.deleteAll(selectedDiapason);
            commit('setSelectedDiapason', newDiapason)
            Alerts.deleteAllDiapasonesAlert()
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
                    Alerts.profileSelectedAlert(newRootDiapason.profile.name, state.layersText)
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
                if (newRootDiapason) {
                    Alerts.profileSelectedAlert(newRootDiapason.profile.name, state.layersText)
                }
            }
        }
    },


    confirm({ state, commit, dispatch }) {
        if (!state.globalProfilesInitialisationFlag) {  // Поведение при инициализации файлом
            if (state.confirmCallback) {
                state.confirmCallback(state.selectedDiapason)
            }
            dispatch('ourExtension/windowFlags/openPreviousWindow', null, { root: true })
        } else {  // Поведение при инициализации глобальными профилями
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