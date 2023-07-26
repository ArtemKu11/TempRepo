import { RootState } from "@/store/types";
import { Module } from "vuex";
import { state } from "./state";
import { GornState } from "./types";
import { getters } from "./getters";
import { actions } from "./actions";

const namespaced = true;

export const gorn: Module<GornState, RootState> = {
    namespaced,
    state,
    getters,
    actions
}