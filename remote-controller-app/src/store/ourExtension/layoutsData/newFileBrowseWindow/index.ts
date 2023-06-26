import { RootState } from "@/store/types";
import { Module } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { state } from "./state";
import { NewFileBrowseWindowState } from "./types";

const namespaced = true;

export const newFileBrowseWindow: Module<NewFileBrowseWindowState, RootState> = {
    namespaced,
    state,
    actions,
    getters,
    mutations
}