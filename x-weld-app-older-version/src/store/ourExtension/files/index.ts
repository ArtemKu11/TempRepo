import { RootState } from "@/store/types"
import { Module } from "vuex"
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { state } from "./state";
import { LightFilesState } from "./types"

const namespaced = true;

export const files: Module<LightFilesState, RootState> = {
    namespaced,
    state,
    actions,
    getters,
    mutations
}