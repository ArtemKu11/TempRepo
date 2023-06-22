import { LightFilesState } from "./files/types";
import { BaseLayoutState } from "./layoutsData/baseLayout/types";
import { LayoutsDataState } from "./layoutsData/types";
import { ProfilesState } from "./profiles/types";
import { TempState } from "./temp/types";
import { WindowFlagsState } from "./windowFlags/types";

export interface OurExtensionState {
    layoutsDataState: LayoutsDataState
    windowFlagsState: WindowFlagsState
    filesState: LightFilesState
    profilesState: ProfilesState
    tempState: TempState
}