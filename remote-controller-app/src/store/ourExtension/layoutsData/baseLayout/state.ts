import { BaseLayoutState } from "./types"

export const defaultState = (): BaseLayoutState => {
    return {
      actualTime: '00:00'
    }
  }
  
  export const state = defaultState()