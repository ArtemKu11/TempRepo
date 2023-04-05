import { Module } from "vuex";
import { MainState } from "../types";
import { auth } from "./auth";
import { config } from "./config";
import { socket } from "./socket";
import { wait } from "./wait";
import { WaitState } from "./wait/types";

const namespaced = true;

export const fluiddExtension: Module<WaitState, MainState> = {
    namespaced,
    modules: {
        auth,
        wait,
        config,
        socket
    }
}