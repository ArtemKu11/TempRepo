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
        const newFlags = JSON.parse(JSON.stringify(initWindowFlags));
        newFlags.mainWindowFlag = false;
        newFlags.filePreviewWindowFlag = true;
        state.flags = newFlags;
    },

    openMoveWindow(state) {
        const newFlags = JSON.parse(JSON.stringify(initWindowFlags));
        newFlags.mainWindowFlag = false;
        newFlags.moveWindowFlag = true;
        state.flags = newFlags;
    },

    openInputWindow(state) {
        state.flags.inputWindowFlag = true;
    },

    openMainSettingsWindow(state) {
        const newFlags = JSON.parse(JSON.stringify(initWindowFlags));
        newFlags.mainWindowFlag = false;
        newFlags.mainSettingsWindowFlag = true;
        state.flags = newFlags;
    },

    openConsoleWindow(state) {
        const newFlags = JSON.parse(JSON.stringify(initWindowFlags));
        newFlags.mainWindowFlag = false;
        newFlags.consoleWindowFlag = true;
        state.flags = newFlags;
    },

    openProfilesWindow(state) {
        const newFlags = JSON.parse(JSON.stringify(initWindowFlags));
        newFlags.mainWindowFlag = false;
        newFlags.profilesWindowFlag = true;
        state.flags = newFlags;
    },

    openSelectListWindow(state) {
        state.flags.selectListWindowFlag = true;
    },

    openPreprintingWindow(state) {
        const newFlags = JSON.parse(JSON.stringify(initWindowFlags));
        newFlags.mainWindowFlag = false;
        newFlags.preprintingWindowFlag = true;
        state.flags = newFlags;
    },

    openPrintingWindow(state) {
        const newFlags = JSON.parse(JSON.stringify(initWindowFlags));
        newFlags.mainWindowFlag = false;
        newFlags.printingWindowFlag = true;
        state.flags = newFlags;
    },

    openPrintSettingsWindow(state) {
        state.flags.printSettingsFlag = true
    },

    openGorelkaMaintenanceWindow(state) {
        const newFlags = JSON.parse(JSON.stringify(initWindowFlags));
        newFlags.mainWindowFlag = false;
        newFlags.gorelkaMaintenanceWindowFlag = true;
        state.flags = newFlags;
    },

    openSystemInfoWindow(state) {
        const newFlags = JSON.parse(JSON.stringify(initWindowFlags));
        newFlags.mainWindowFlag = false;
        newFlags.systemInfoWindow = true;
        state.flags = newFlags;
    }
}