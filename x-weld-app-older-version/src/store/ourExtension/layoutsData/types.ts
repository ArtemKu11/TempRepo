import { BaseLayoutState } from "./baseLayout/types";
import { FileBrowseWindowState } from "./fileBrowseWindow/types";
import { FilePreviewWindowState } from "./filePreviewWindow/types";
import { InputWindowState } from "./inputWindow/types";
import { MainWindowState } from "./mainWindow/types";
import { MoveWindowState } from "./moveWindow/types";
import { NewFileBrowseWindowState } from "./newFileBrowseWindow/types";

export interface LayoutsDataState {
    baseLayout: BaseLayoutState,
    mainWindow: MainWindowState,
    fileBrowseWindow: FileBrowseWindowState
    newFileBrowseWindow: NewFileBrowseWindowState
    filePreviewWindow: FilePreviewWindowState
    moveWindow: MoveWindowState
    inputWindow: InputWindowState
}