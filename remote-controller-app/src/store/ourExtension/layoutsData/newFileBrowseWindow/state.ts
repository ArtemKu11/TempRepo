import { NewFileBrowseWindowState } from "./types";

export const newFileBrowserWindowState = () : NewFileBrowseWindowState => {
    return {
        currentPath: '',
        directoryList: [],
        fileList: [],
        selectedFile: null
    }
};

export const state = newFileBrowserWindowState();