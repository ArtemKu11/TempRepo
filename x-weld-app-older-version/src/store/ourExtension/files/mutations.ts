import { MutationTree } from "vuex";
import { getRootDiapason, getSortedMapKeys } from "../profiles/helpers";
import { PrintingDiapason } from "../profiles/types";
import { GcodePrintingProfiles, LightFilesState, LastPrintingFile } from "./types";

export const mutations: MutationTree<LightFilesState> = {
    setLayersByMoonrakerPath(state, payload) {
        if (payload.path && 'layers' in payload && state.fileSystem.gcodes.has(payload.path)) {
            const fileData = state.fileSystem.gcodes.get(payload.path);
            if (fileData) {
                fileData.layers = payload.layers;
            }
        }
    },

    refreshGcodeParser(state) {
        state.isLoadingFinish = false;
        state.isLoadingFinish = true;
    },

    setLastPrintingFile(state, payload: LastPrintingFile) {
        state.lastPrintingFile = payload;
    }
}