import { RootState } from "@/store/types";
import { PreprintingWindowState } from "./types";
import { Module } from "vuex";
import { state } from "./state";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";

const namespaced = true;
export const preprintingWindow: Module<PreprintingWindowState, RootState> = {
    namespaced,
    state,
    actions,
    getters,
    mutations
}