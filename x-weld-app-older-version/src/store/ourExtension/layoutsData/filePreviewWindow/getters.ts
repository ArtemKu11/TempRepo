import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { FileData } from "../fileBrowseWindow/types";
import { FilePreviewWindowState } from "./types";

export const getters: GetterTree<FilePreviewWindowState, RootState> = {
    getFileData: state => (): FileData => {
        const currentFileData = state.fileData;
        if (currentFileData) {
            return currentFileData;
        } else {
            return {
                fileId: 0,
                name: "---",
                size: 0,
                date: "---",
                isActive: false
            }
        }
    }
}