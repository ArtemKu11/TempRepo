import { ActionTree } from 'vuex'
import { WaitState } from './types'
import { MainState } from '@/store/types'

export const actions: ActionTree<WaitState, MainState> = {
  /**
   * Reset our store
   */
  async reset ({ commit }) {
    commit('setReset')
  },

  /**
   * Add's a wait to the list of waits.
   */
  async addWait ({ commit }, wait) {
    commit('setAddWait', wait)
  },

  /**
   * Removes a wait from the list of waits.
   */
  async removeWait ({ commit }, wait) {
    commit('setRemoveWait', wait)
  }
}
