import { Module } from "vuex";
import { PrintingWindowState } from "./types";
import { RootState } from "@/store/types";
import { state } from "./state";
import { getters } from "./getters";
import { actions } from "./actions";

const namespaced = true
export const printingWindow: Module<PrintingWindowState, RootState> = {
    namespaced,
    state,
    getters,
    actions
}