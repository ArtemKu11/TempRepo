import { alerts } from "./alerts";
import { baseLayout } from "./baseLayout";
import fileBrowseWindow from "./fileBrowseWindow";
import filePreviewWindow from "./filePreviewWindow";
import { inputWindow } from "./inputWindow";
import mainWindow from "./mainWindow";
import { moveWindow } from "./moveWindow";
import { newFileBrowseWindow } from "./newFileBrowseWindow";
import { preprintingWindow } from "./preprintingWindow";
import { printingWindow } from "./printingWindow";
import { profilesWindow } from "./profilesWindow";
import { selectListWindow } from "./selectListWindow";

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
        inputWindow,
        profilesWindow,
        selectListWindow,
        preprintingWindow,
        printingWindow,
        alerts
    }
}