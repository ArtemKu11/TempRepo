import { PrintingWindowState } from "./types";

export const defaultState = (): PrintingWindowState => {
    return {
        file: null,
        printingDiapason: null,
        printingSettings: {
            shiftForAllLayers: false,
            pauseBetweenLayers: false,
            pauseValue: '00:59',
            setNextLayer: false,
            nextLayerValue: 0
        },
        shift: 0
    }
}

export const state = defaultState()