import { MainState } from "@/store/types"
import { Module } from "vuex"
import { state } from "./state"
import { ConfigState } from "./types"

const namespaced = true

export const config: Module<ConfigState, MainState> = {
  namespaced,
  state,
}
