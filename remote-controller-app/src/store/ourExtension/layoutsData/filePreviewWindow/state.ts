import { FilePreviewWindowState } from "./types";

export const filePreviewWindowState = (): FilePreviewWindowState => {
    return {
        selectedDiapason: null
    }
}

export const state = filePreviewWindowState();