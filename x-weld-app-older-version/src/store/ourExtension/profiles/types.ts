export interface ProfilesState {
    profilesList: Profile[]
    lastPrintingProfile: Profile | null
    profilesMetadata: ProfilesMetadata | null
}

export interface Profile {
    name: string
    profileMainParameters: ProfileMainParameters
    profileAdditionalParameters: ProfileAdditionalParameters
    profileOscilationParameters: ProfileOscilationParameters
    profileWeldParameters: ProfileWeldParameters
}

export interface ProfileMainParameters {
    current: number  // Ток, А
    voltage: number  // Напряжение, В
    feedRate: number  // Скорость подачи, м/мин
}

export interface ProfileAdditionalParameters {
    arcLength: number  // Длина дуги, хз какие единицы
    dynamic: number  // Динамика, хз какие единицы
    weldingSpeed: number  // Скорость наплавки, м/мин
}

export interface ProfileOscilationParameters {
    type: string  // Тип осциляции
    width: number  // Ширина, мм
    period: number  // Период, мм
}

export interface ProfileWeldParameters {
    gas: string  // Газ
    wireDiameter: number,  // Длина проволоки, мм
    material: string  // Материал
    method: string  // Способ
}

export interface ProfilesMetadata {
    gas: string[],
    oscilationTypes: string[],
    weldTypes: string[],
    wireDiameters: number[],
    materials: string[]
}   

export interface PrintingDiapason {
    profile: Profile,
    isRootDiapason: boolean,
    firstLayer?: number,
    lastLayer?: number
    nextDiapason?: PrintingDiapason | null
    prevDiapason?: PrintingDiapason | null
}

export interface PrintingDiapasonForMoonraker {
    profile: Profile,
    allLayersFlag: boolean,
    firstLayer: number | null,
    lastLayer: number | null
}


export interface PrintingDiapasonProcessor {
    hasNext(printingDiapason: PrintingDiapason): boolean
    hasPrev(printingDiapason: PrintingDiapason): boolean
    next(printingDiapason: PrintingDiapason): PrintingDiapason | null
    prev(printingDiapason: PrintingDiapason): PrintingDiapason | null
    deleteCurrent(printingDiapason: PrintingDiapason): PrintingDiapason
    createNext(printingDiapason: PrintingDiapason): void
    deleteAll(printingDiapason: PrintingDiapason): PrintingDiapason
    getRootDiapason(printingDiapason: PrintingDiapason): PrintingDiapason
    searchInPrevDiapasones(printingDiapason: PrintingDiapason): PrintingDiapason | null
    searchInNextDiapasones(printingDiapason: PrintingDiapason): PrintingDiapason | null
}