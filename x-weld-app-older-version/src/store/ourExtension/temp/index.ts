import { RootState } from "@/store/types"
import { Module } from "vuex"
import { state } from "./state"
import { TempState } from "./types"
import { getters } from "./getters"
import { actions } from "./actions"

const namespaced = true

export const temp: Module<TempState, RootState> = {
    namespaced,
    state,
    getters,
    actions
}