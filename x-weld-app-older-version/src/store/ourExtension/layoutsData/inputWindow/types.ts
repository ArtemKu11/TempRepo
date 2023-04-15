export interface InitInputWindowData {
    inputWindowData: InputWindowData
    valcoderStep: number
}

export interface InputWindowData {
    initValue: number;
    coordName: string;
    dispachAfterConfirm: string;
}

export interface FlagsObject {
    defaultImplementation: boolean
}

export interface InputWindowState {
    inputWindowData?: InputWindowData,
    processingValue: string,  // Здесь будет значение, которое отображается в шаблоне и визуально меняется
    finalValue: number  // Это значение отдается в dispachAfterConfirm
    keyboardFlag: boolean 
    valcoderStep: number
    flags: FlagsObject
}