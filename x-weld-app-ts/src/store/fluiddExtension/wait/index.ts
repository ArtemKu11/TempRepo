import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { WaitState } from './types'
import { MainState } from '@/store/types'

const namespaced = true

export const wait: Module<WaitState, MainState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
