import { SelectListWindowState } from "./types"

export const defaultState = (): SelectListWindowState => {
    return {
        listItems: [],
    }
}

export const state = defaultState()