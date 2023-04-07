import { Module } from "vuex";
import { actions } from "../socket/actions";
import { RootState } from "../types";
import layoutsData from "./layoutsData";
import { OurExtensionState } from "./types";
import windowFlags from "./windowFlags";

const namespaced = true;

export const ourExtension: Module<OurExtensionState, RootState> = {
    namespaced,
    modules: {
        layoutsData,
        windowFlags
    },
    actions: {
        reset() {

        }
    }
  }