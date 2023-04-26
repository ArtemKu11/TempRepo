import { MutationTree } from "vuex";
import { FileData } from "../../files/types";
import { printingDiapasonProcessor } from "../../profiles/helpers";
import { PrintingDiapason } from "../../profiles/types";
import { ProfilesWindowState } from "./types";

export const mutations: MutationTree<ProfilesWindowState> = {
    setFile(state, payload: FileData) {
        state.file = payload;
        state.globalLastPrintingDiapason = undefined
        state.globalProfilesInitialisationFlag = undefined
        state.globalProfilesMap = undefined
        state.selectedDiapason = undefined
    },

    setSelectedDiapason(state, payload: PrintingDiapason) {
        state.selectedDiapason = payload;
        if (!state.lastPrintingProfileFlag) {
            const fileProfiles = state.file?.profiles;
            if (fileProfiles) {
                fileProfiles.selectedDiapason = payload;
            }
        }
        if (typeof payload.lastLayer === 'number' && typeof payload.firstLayer === 'number') {
            state.layersText = `(${payload.firstLayer} - ${payload.lastLayer})`
        } else {
            state.layersText = `(Все слои)`
            if (state.globalProfilesInitialisationFlag) {
                state.layersText = '(Глобально)'
            }
        }
    },

    setHeaderText(state, payload: string) {
        state.headerText = payload
    },

    reset(state) {
        state.file = null,
        state.confirmCallback = null
        state.selectedDiapason = null
        state.globalLastPrintingDiapason = null
        state.globalProfilesInitialisationFlag = null
        state.globalProfilesMap = null
    },

    openLayersSetupWindow(state) {
        state.layersSetupWindowFlag = true;
    },

    closeLayersSetupWindow(state) {
        state.layersSetupWindowFlag = false;
    }

}