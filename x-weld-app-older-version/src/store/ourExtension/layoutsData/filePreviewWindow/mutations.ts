import { MutationTree } from "vuex";
import { FileData } from "../../files/types";
import { FilePreviewWindowState } from "./types";
import { PrintingDiapason } from "../../profiles/types";

export const mutations: MutationTree<FilePreviewWindowState> = {
    setFileData(state, newFileData: FileData) {
        state.fileData = newFileData;
        state.selectedDiapason = null
    },

    setSelectedDiapason(state, payload: PrintingDiapason) {
        state.selectedDiapason = payload
    }
}