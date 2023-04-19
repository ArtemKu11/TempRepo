import { RootState } from "@/store/types";
import { Module } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { state } from "./state";
import { ProfilesWindowState } from "./types";

const namespaced = true;
export const profilesWindow: Module<ProfilesWindowState, RootState> = {
    namespaced,
    state,
    getters,
    mutations,
    actions
}