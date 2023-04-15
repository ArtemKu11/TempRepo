import { RootState } from "@/store/types";
import { Module } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { state } from "./state";
import { MoveWindowState } from "./types";

const namespaced = true;

export const moveWindow: Module<MoveWindowState, RootState> = {
    namespaced,
    state,
    mutations,
    getters,
    actions
}