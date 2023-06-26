import { FileData } from "../../files/types";
import { PrintingDiapason, Profile } from "../../profiles/types";

export interface ProfilesWindowState {
    file?: FileData | null,
    selectedDiapason?: PrintingDiapason | null,
    confirmCallback?: Function | null,
    headerText: string,
    layersText: string,
    lastPrintingProfileFlag: boolean,
    layersSetupWindowFlag: boolean

    ////////////////////////////////////////////
    globalProfilesMap?: Map<string, PrintingDiapason> | null  // copy
    globalLastPrintingDiapason?: PrintingDiapason | null  // copy
    globalProfilesInitialisationFlag?: boolean | null
}