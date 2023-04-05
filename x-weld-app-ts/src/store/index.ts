import { createStore } from 'vuex'
import { fluiddExtension } from './fluiddExtension'
import layoutsData from './layoutsData'
import windowFlags from './windowFlags'

export default createStore({
  modules: {
    layoutsData,
    windowFlags,
    fluiddExtension
  }
})
