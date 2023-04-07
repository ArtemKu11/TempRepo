import { RootState } from "@/store/types"
import { Module } from "vuex"
import { actions } from "./actions"
import { getters } from "./getters"
import { mutations } from "./mutations"
import { state } from "./state"
import { BaseLayoutState } from "./types"

const namespaced = true

export const baseLayout: Module<BaseLayoutState, RootState> = {
  namespaced,
  getters,
  actions,
  mutations,
  state
}