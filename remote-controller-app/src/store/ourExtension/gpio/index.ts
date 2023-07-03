import { RootState } from "@/store/types";
import { Module } from "vuex";
import { state } from "./state";
import { GpioState } from "./types";
import { mutations } from "./mutations";
import { getters } from "./getters";

const namespaced = true;

export const gpio: Module<GpioState, RootState> = {
    namespaced,
    state,
    mutations,
    getters
}