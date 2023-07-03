import { Module } from "vuex";
import { actions } from "../socket/actions";
import { RootState } from "../types";
import { files } from "./files";
import layoutsData from "./layoutsData";
import { profiles } from "./profiles";
import { OurExtensionState } from "./types";
import windowFlags from "./windowFlags";
import { gpio } from "./gpio";

const namespaced = true;

export const ourExtension: Module<OurExtensionState, RootState> = {
    namespaced,
    modules: {
        layoutsData,
        windowFlags,
        files,
        profiles,
        gpio
    },
    actions: {
        reset() {
        }
    }
  }