import { RootState } from "@/store/types";
import { Module } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { state } from "./state";
import { ProfilesState } from "./types";


const namespaced = true;

export const profiles: Module<ProfilesState, RootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters,
}