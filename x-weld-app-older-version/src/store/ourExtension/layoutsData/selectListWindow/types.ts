export interface SelectListWindowState {
    listItems: ListInstance[]
    // mapItems: Map<string, ListInstance> | null,
    callbackAfterSelect?: Function
}

export interface ListInstance {
    name: string;
    isActive: boolean;
    icon?: string
}

export interface SelectListInitData {
    initMap?: Map<string, string>
    initList?: string[]
    callbackAfterConfirm?: Function
}