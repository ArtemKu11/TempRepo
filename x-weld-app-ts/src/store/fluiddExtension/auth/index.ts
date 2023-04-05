import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { AuthState } from './types'
import { MainState } from '@/store/types'

const namespaced = true

export const auth: Module<AuthState, MainState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
