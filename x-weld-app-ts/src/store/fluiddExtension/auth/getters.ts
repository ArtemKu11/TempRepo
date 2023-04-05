import { GetterTree } from 'vuex'
import { AuthState } from './types'
import { MainState } from '@/store/types'

export const getters: GetterTree<AuthState, MainState> = {
  getAuthenticated: (state): boolean => {
    return state.authenticated
  },

  getCurrentUser: (state) => {
    return state.currentUser
  },

  getUsers: (state) => {
    return state.users
  },

  getToken: (state) => {
    return state.token
  },

  getRefreshToken: (state) => {
    return state.refresh_token
  },

  getApiKey: (state) => {
    return state.apiKey
  }
}
