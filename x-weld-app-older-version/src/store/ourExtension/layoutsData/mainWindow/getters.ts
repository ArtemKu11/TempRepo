import { MainWindowButtonInfo, MainWindowState } from "./types";

export default {
    getButtonList(state: MainWindowState): Array<MainWindowButtonInfo> {
        return state.buttonList;
    }
}