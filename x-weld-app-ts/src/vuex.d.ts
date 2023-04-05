import { Store } from 'vuex'
import { MainState } from './store/types'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store<MainState>
    }
}