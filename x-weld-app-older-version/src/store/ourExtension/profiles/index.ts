import { RootState } from "@/store/types";
import { Module } from "vuex";
import { state } from "./state";
import { ProfilesState } from "./types";


const namespaced = true;

export const profiles: Module<ProfilesState, RootState> = {
    namespaced,
    state
}