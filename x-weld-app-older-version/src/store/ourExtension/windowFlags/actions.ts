import { ActionTree } from "vuex";
import { FlagsObject, WindowFlagsState } from "./types";
import { RootState } from "@/store/types";

export const actions: ActionTree<WindowFlagsState, RootState> = {

    openFileBrowseWindow({ commit, getters }) {
        commit('openFileBrowseWindow');  // 1. Изменить флаги (Показать окно)
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();  // 2. Получить эти флаги
        commit('saveCurrentLayoutInStack', currentFlags);  // 3. Сохранить в стек (Кнопка "Назад" будет возвращать пред. окно)
    },

    // ИЛИ
    openMainWindow({ commit, getters }) {
        commit('openMainWindow');  // 1. Изменить флаги (Показать окно)
        commit('setWindowStack', [getters.getInitFlagsObject()]) // 2. Обнулить стек (Кнопка "Назад" будет возвращать MainWindow)
    },

    openFilePreviewWindow({ commit, getters }) {
        commit('openFilePreviewWindow');
        const currentFlags: FlagsObject = getters.getCurrentFlagsObject();
        commit('saveCurrentLayoutInStack', currentFlags);
    },

    openPreviousWindow({ commit }) {
        commit('openPreviousWindow')
    },
}