import consola from 'consola'
import './setupConsola'
import Vue from 'vue'
import App from './App.vue'
import { Globals } from './globals'
import { appInit } from './init'
import { ColorSetPlugin } from './plugins/colorSet'
import { FiltersPlugin } from './plugins/filters'
import { HttpClientPlugin } from './plugins/httpClient'
import { SocketPlugin } from './plugins/socketClient'
import store from './store'
import { InitConfig } from './store/config/types'

Vue.config.productionTip = false


Vue.use(FiltersPlugin)
Vue.use(ColorSetPlugin, {})
Vue.use(HttpClientPlugin, {
    store
})

appInit()
    .then((config: InitConfig) => {
        Vue.use(SocketPlugin, {
            url: config.apiConfig.socketUrl,
            reconnectEnabled: true,
            reconnectInterval: Globals.SOCKET_RETRY_DELAY,
            store
        })

        // if (config.apiConfig.socketUrl && config.apiConnected && config.apiAuthenticated) {
        //     Vue.$socket.connect(config.apiConfig.socketUrl)
        // }
        Vue.$socket.connect(config.apiConfig.socketUrl)


        new Vue({
            store,
            render: h => h(App)
        }).$mount('#app')
    })
    .catch((e) => {
        consola.debug('Error attempting to init App:', e)
    })



