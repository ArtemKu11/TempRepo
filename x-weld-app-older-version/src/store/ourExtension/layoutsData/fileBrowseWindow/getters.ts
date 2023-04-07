import { FileBrowseWindowState } from "./types";

export default {
    getListOfFiles(state: FileBrowseWindowState) {
        state.fileList[0].isActive = true;
        return state.fileList;
    }
}