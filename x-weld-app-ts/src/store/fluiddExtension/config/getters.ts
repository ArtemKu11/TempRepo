import { MainState } from "@/store/types";
import { GetterTree } from "vuex";
import { ConfigState } from "./types";
import md5 from 'md5'


export const getters: GetterTree<ConfigState, MainState> = {
    getTokenKeys: (state) => {
        const url = state.apiUrl
        const hash = (url) ? md5(url) : ''
        return {
          'user-token': `user-token-${hash}`,
          'refresh-token': `refresh-token-${hash}`
        }
      }
}