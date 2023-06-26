import { RootState } from "@/store/types";
import { Module } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { state } from "./state";
import { SelectListWindowState } from "./types";

const namespaced = true;
export const selectListWindow: Module<SelectListWindowState, RootState> = {
    namespaced,
    state,
    actions,
    getters
}