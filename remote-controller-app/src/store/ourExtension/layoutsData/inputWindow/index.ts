import { RootState } from "@/store/types";
import { Module } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { state } from "./state";
import { InputWindowState } from "./types";


const namespaced = true;
export const inputWindow: Module<InputWindowState, RootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
}