import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { SocketState } from './types'
import { MainState } from '@/store/types'

const namespaced = true

export const socket: Module<SocketState, MainState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
