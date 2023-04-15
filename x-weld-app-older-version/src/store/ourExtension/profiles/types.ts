export interface ProfilesState {
    profilesList: ProfileForFile[]
    lastSelectedProfile: PrintingDiapason | null
}

// export interface ProfileInfo {
//     profile: Profile
//     printingDiapason?: PrintingDiapason
// }

export interface ProfileForFile {
    profileName: string
    diapasones: PrintingDiapason[]
}

export interface PrintingDiapason {
    diapason?: LayersDiapason
    diapasonProfileParameters: Profile
}

export interface LayersDiapason {
    firstLayer: number
    lastLayer: number
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