import { MutationTree } from "vuex";
import { initWindowFlags } from "./state";
import { FlagsObject, WindowFlagsState } from "./types";

export const mutations: MutationTree<WindowFlagsState> = {

    openPreviousWindow(state) {
        if (state.stack.length > 1) { // Если открыто не MainWindow
            state.stack.pop() // Удаляем последнее открытое окно
            const previousFlags = state.stack[state.stack.length - 1]; // Достаем предыдущие флаги
            if (previousFlags) {
                state.flags = JSON.parse(JSON.stringify(previousFlags));  // Сетаем их в state
            }
        } else {
            const previousFlags = state.stack[0];
            if (previousFlags) {
                state.flags = JSON.parse(JSON.stringify(previousFlags));
            }
        }
    },

    saveCurrentLayoutInStack(state, currentFlags: FlagsObject) {
        state.stack.push(currentFlags);
    },

    setWindowStack(state, stack) {
        state.stack = stack;
    },

    openMainWindow(state) {
        const initFlags = JSON.parse(JSON.stringify(initWindowFlags));
        state.flags = initFlags;
    },

    openFileBrowseWindow(state) {
        state.flags.fileBrowseWindowFlag = true;
    },

    openFilePreviewWindow(state) {
        state.flags = {
            mainWindowFlag: false,
            fileBrowseWindowFlag: false,
            filePreviewWindowFlag: true
        }
    },
}