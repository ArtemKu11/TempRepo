import { FileData } from "../../files/types";
import { PrintingDiapason, Profile } from "../../profiles/types";

export interface ProfilesWindowState {
    file?: FileData | null,
    selectedDiapason?: PrintingDiapason,
    headerText: string,
    layersText: string,
    lastPrintingProfileFlag: boolean,
    layersSetupWindowFlag: boolean

    ////////////////////////////////////////////
    globalProfilesMap?: Map<string, PrintingDiapason>  // copy
    globalLastPrintingDiapason?: PrintingDiapason  // copy
    globalProfilesInitialisationFlag?: boolean
}