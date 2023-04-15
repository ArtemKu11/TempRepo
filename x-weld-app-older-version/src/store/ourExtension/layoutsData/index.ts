import { baseLayout } from "./baseLayout";
import fileBrowseWindow from "./fileBrowseWindow";
import filePreviewWindow from "./filePreviewWindow";
import { inputWindow } from "./inputWindow";
import mainWindow from "./mainWindow";
import { moveWindow } from "./moveWindow";
import { newFileBrowseWindow } from "./newFileBrowseWindow";

const namespaced = true;



export default {
    namespaced,
    modules: {
        baseLayout,
        mainWindow,
        fileBrowseWindow,
        newFileBrowseWindow,
        filePreviewWindow,
        moveWindow,
        inputWindow
    }
}