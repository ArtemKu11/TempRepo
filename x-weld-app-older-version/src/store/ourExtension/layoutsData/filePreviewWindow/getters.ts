import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { FileData } from "../../files/types";
import { FilePreviewWindowState } from "./types";

export const getters: GetterTree<FilePreviewWindowState, RootState> = {
    getFileData: state => (): FileData => {
        const currentFileData = state.fileData;
        if (currentFileData) {
            return currentFileData;
        } else {
            return {
                name: "---",
                sizeInKb: '?',
                computedSize: '?kb',
                size: -1,
                modified: '--:--:----',
                isSelected: false,
                layers: "?",
                permissions: "?",
                printingTime: "?h ?m",
                pathForMoonraker: "",
                dirnameForMoonraker: ""
            }
        }
    },

    getFile: (state) => () => {
        return state.fileData
    },

    getSelectedDiapason: (state) => () => {
        return state.selectedDiapason
    }
}