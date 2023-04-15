import { MutationTree } from "vuex";
import { FileData } from "../../files/types";
import { FilePreviewWindowState } from "./types";

export const mutations: MutationTree<FilePreviewWindowState> = {
    setFileData(state, newFileData: FileData) {
        state.fileData = newFileData;
    } 
}