import { BaseLayoutState } from "./baseLayout/types";
import { FileBrowseWindowState } from "./fileBrowseWindow/types";
import { FilePreviewWindowState } from "./filePreviewWindow/types";
import { MainWindowState } from "./mainWindow/types";

export interface LayoutsDataState {
    baseLayoutState: BaseLayoutState,
    mainWindow: MainWindowState,
    fileBrowseWindow: FileBrowseWindowState
    filePreviewWindow: FilePreviewWindowState
}