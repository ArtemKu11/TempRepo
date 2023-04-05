import fileBrowseWindow from "./fileBrowseWindow";
import filePreviewWindow from "./filePreviewWindow";
import mainWindow from "./mainWindow";

const namespaced = true;



export default {
    namespaced,
    modules: {
        mainWindow,
        fileBrowseWindow,
        filePreviewWindow
    }
}