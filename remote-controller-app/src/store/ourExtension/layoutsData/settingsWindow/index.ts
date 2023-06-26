import { Module } from "vuex";
import { RootState } from "@/store/types";
import { SettingsWindowState } from "./types";
import { state } from "./state";
import { actions } from "./actions";
import { getters } from "./getters";

export const namespaced = true
export const settingsWindow: Module<SettingsWindowState, RootState> = {
    namespaced,
    state,
    actions,
    getters
}