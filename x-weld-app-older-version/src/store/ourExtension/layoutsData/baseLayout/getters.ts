import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { BaseLayoutState } from "./types";

export const getters: GetterTree<BaseLayoutState, RootState> = {
    getActualTime: state => (): string => {
        return state.actualTime;
    }
}