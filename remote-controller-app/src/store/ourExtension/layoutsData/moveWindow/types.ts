export interface CoordinatesHolder {
    x: number
    y: number
    z: number
}

export interface StepSelectorInfo {
    currentStep: number
    stepValues: Array<number>
    percentValues: Array<number>
}

export interface MoveWindowState {
    coordinates: CoordinatesHolder
    stepSelectorInfo: StepSelectorInfo,
    needToSendGcodeMove: boolean
}