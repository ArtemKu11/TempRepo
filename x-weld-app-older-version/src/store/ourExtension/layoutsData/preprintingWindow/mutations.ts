import { MutationTree } from "vuex";
import { PreprintingWindowState } from "./types";
import { FileData } from "../../files/types";

export const mutations: MutationTree<PreprintingWindowState> = {
    setFile(state, payload: FileData) {
        state.file = payload;
    }
}