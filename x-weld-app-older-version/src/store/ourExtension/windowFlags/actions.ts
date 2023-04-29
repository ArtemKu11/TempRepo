import { ActionTree } from "vuex";
import { FlagsObject, WindowFlagsState } from "./types";
import { RootState } from "@/store/types";
import { SocketActions } from "@/api/socketActions";

export const actions: ActionTree<WindowFlagsState, RootState> = {

    // openFileBrowseWindow() {
    //     SocketActions.serverGetGcodes();
    // },

    clearStack({ commit, dispatch, getters, rootState }) {
        commit('setWindowStack', [getters.getInitFlagsObject()])
    },

    onOpenFileBrowseWindow({ commit, dispatch, getters, rootState }, payload) {
        commit('openFileBrowseWindow');  // 1. Изменить флаги (Показать окно)
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();  // 2. Получить эти флаги
        commit('saveCurrentLayoutInStack', currentFlags);  // 3. Сохранить в стек (Кнопка "Назад" будет возвращать пред. окно)
    },

    openFileBrowseWindow({ commit, dispatch, getters, rootState }, payload) {
        commit('openFileBrowseWindow');  // 1. Изменить флаги (Показать окно)
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();  // 2. Получить эти флаги
        commit('saveCurrentLayoutInStack', currentFlags);  // 3. Сохранить в стек (Кнопка "Назад" будет возвращать пред. окно)
    },

    // ИЛИ
    openMainWindow({ commit, getters }) {
        commit('openMainWindow');  // 1. Изменить флаги (Показать окно)
        commit('setWindowStack', [getters.getInitFlagsObject()]) // 2. Обнулить стек (Кнопка "Назад" будет возвращать MainWindow)
    },

    // ИЛИ
    openMoveWindow({ dispatch, commit, getters }) {
        dispatch('ourExtension/layoutsData/moveWindow/reset', null, { root: true })
        // commit("openMoveWindow");  // 1. Изменить флаги (Показать окно)
        // commit('setWindowStack', [getters.getInitFlagsObject()])  // 2. Обнулить стек (Кнопка "Назад" в данном окне будет возвращать MainWindow)
        // const currentFlags: FlagsObject = getters.getCurrentFlagsObject();  // 3. Сохранить в стэк текущее окно
        // commit('saveCurrentLayoutInStack', currentFlags);  // (Кнопка "Назад" в следующем окне вернет сначала данное окно, а затем MainWindow)
        commit('openMoveWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },

    openFilePreviewWindow({ commit, getters }) {
        commit('openFilePreviewWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },

    openPreviousWindow({ commit }) {
        commit('openPreviousWindow')
    },

    openInputWindow({ dispatch, commit, getters }) {
        commit('openInputWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },

    openMainSettingsWindow({ dispatch, commit, getters }) {
        // commit('openMainSettingsWindow');
        // commit('setWindowStack', [getters.getInitFlagsObject()])
        // const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        // commit('saveCurrentLayoutInStack', currentFlags);
        commit('openMainSettingsWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },

    openConsoleWindow({ commit, getters }) {
        commit('openConsoleWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },

    openProfilesWindow({ commit, getters, state, dispatch }) {
        commit('openProfilesWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },

    openSelectListWindow({ commit, getters }) {
        commit('openSelectListWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },

    openPreprintingWindow({ commit, getters }) {
        commit('openPreprintingWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },

    openPrintingWindow({ commit, getters }) {
        commit('openPrintingWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },

    openPrintSettingsWindow({ commit, getters }) {
        commit('openPrintSettingsWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },

    openGorelkaMaintenanceWindow({ commit, getters }) {
        commit('openGorelkaMaintenanceWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },

    openSystemInfoWindow({ commit, getters }) {
        commit('openSystemInfoWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },
}