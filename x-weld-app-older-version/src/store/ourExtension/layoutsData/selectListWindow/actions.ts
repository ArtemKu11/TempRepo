import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { defaultState } from "./state";
import { ListInstance, SelectListInitData, SelectListWindowState } from "./types";

export const actions: ActionTree<SelectListWindowState, RootState> = {
    reset({ state }) {
        Object.assign(state, defaultState())
        state.zIndex = undefined
    },

    initWithIcons({ state }, payload: SelectListInitData) {  // <название, иконка>
        state.callbackAfterSelect = payload.callbackAfterConfirm;
        const initMap = payload.initMap
        if (!initMap) return;

        const listItems: ListInstance[] = []
        for (const [key, value] of initMap) {
            const listInstance: ListInstance = {
                isActive: false,
                name: key,
                icon: value
            }
            listItems.push(listInstance)
        }
        state.listItems = listItems;
        state.zIndex = payload.zIndex
    },

    initWithoutIcons({ state }, payload: SelectListInitData) { 
        state.callbackAfterSelect = payload.callbackAfterConfirm;
        const initList = payload.initList
        if (!initList) return;

        const listItems: ListInstance[] = []
        for (const item of initList) {
            const listInstance: ListInstance = {
                isActive: false,
                name: item
            }
            listItems.push(listInstance)
        }
        state.listItems = listItems;
        state.zIndex = payload.zIndex
    },

    deactivateItems({ state, getters }) {
        for (const item of state.listItems) {
            item.isActive = false;
        }
    },

    confirm({state, dispatch}, payload: string) {
        if (state.callbackAfterSelect) {
            state.callbackAfterSelect(payload)
        }
        dispatch('ourExtension/windowFlags/openPreviousWindow', null, { root: true })
    }
}