import { WaitState } from './types'

export const defaultState = (): WaitState => {
  return {
    waits: [] // Тут хранятся стринги из glodal.ts в корне (onServiceRestart например)
  }
}

export const state = defaultState()
