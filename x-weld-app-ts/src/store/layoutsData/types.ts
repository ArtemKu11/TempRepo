import { FileBrowseWindowState } from "./fileBrowseWindow/types";
import { FilePreviewWindowState } from "./filePreviewWindow/types";
import { MainWindowState } from "./mainWindow/types";

export interface LayoutsDataState {
    mainWindow: MainWindowState,
    fileBrowseWindow: FileBrowseWindowState
    filePreviewWindow: FilePreviewWindowState
}