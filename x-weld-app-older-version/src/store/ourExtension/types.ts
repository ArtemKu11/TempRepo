import { BaseLayoutState } from "./layoutsData/baseLayout/types";
import { LayoutsDataState } from "./layoutsData/types";
import { WindowFlagsState } from "./windowFlags/types";

export interface OurExtensionState {
    layoutsDataState: LayoutsDataState
    windowFlagsState: WindowFlagsState
}