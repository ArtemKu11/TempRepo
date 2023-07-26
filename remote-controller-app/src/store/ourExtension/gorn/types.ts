export interface GornState {
    clientState: GornClientState
}

export interface GornClientState {
    [key: string]: UnitClientState  // key как правило unitN (unit1, unit2 и т.д.)
}

export interface GornServerState {
    [key: string]: UnitServerState  // key как правило unit_N (unit_1, unit_2 и т.д.)
}

export interface UnitServerState {
    current_fact: number,
    current_max: number,
    current_setting: number,
    state: string,
    voltage_fact: string,
    voltage_max: number,
    voltage_setting: number,
    unit: number
}

export interface UnitClientState {
    currentDesired: number,
    voltageDesired: number
}