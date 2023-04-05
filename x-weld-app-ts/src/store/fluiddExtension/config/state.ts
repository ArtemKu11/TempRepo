import { ConfigState } from './types'

export const defaultState = (): ConfigState => {
  return {
    apiUrl: '',
    socketUrl: '',
  }
}

export const state = defaultState()
