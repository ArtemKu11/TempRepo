import { FileData } from "../../files/types"
import { PrintingDiapasonForMoonraker } from "../../profiles/types"

export interface PrintingWindowState {
    file: FileData | null
    printingDiapason: PrintingDiapasonForMoonraker | null
    printingSettings: PrintingSettings,
    shift: number
}

export interface PrintingSettings {
    shiftForAllLayers: boolean,
    pauseBetweenLayers: boolean
    pauseValue: string,
    setNextLayer: boolean,
    nextLayerValue: number
}