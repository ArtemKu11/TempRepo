export interface InitInputWindowData {
    inputWindowData: InputWindowData
    valcoderStep: number
}

export interface InputWindowData {
    initValue: number;  // Значение, которым инициализируется окно
    coordName: string;
    dispachAfterConfirm: string;
    callbackAfterConfirm?: Function
    maxValue?: number,
    minValue?: number
    rejectPointClick?: boolean
    coordUnits?: string
    isItTime?: boolean
    isItOnlineValcoder?: boolean  // !! Не использовать вместе с isItTime. !! Написать под этот флаг соответствующий хандлер/процессор
}

export interface FlagsObject {
    defaultImplementation: boolean
    notDefaultImplementation: boolean
}

export interface InputWindowState {
    inputWindowData?: InputWindowData,
    processingValue: string,  // Здесь будет значение, которое отображается в шаблоне и визуально меняется
    finalValue: number  // Это значение отдается в dispachAfterConfirm / callbackAfterConfirm
    keyboardFlag: boolean 
    valcoderStep: number
    flags: FlagsObject
    rejectPointClick: boolean
}