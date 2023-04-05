import { FluiddExtensionState } from "./fluiddExtension/types";
import { LayoutsDataState } from "./layoutsData/types";
import { WindowFlagsState } from "./windowFlags/types";

export interface MainState {
    layoutsDataState: LayoutsDataState
    windowFlags: WindowFlagsState,
    fluiddExtension: FluiddExtensionState
}