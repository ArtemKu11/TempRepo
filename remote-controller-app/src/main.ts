import consola from 'consola'
import './setupConsola'
import Vue from 'vue'
import App from './App.vue'
import { Globals } from './globals'
import { appInit } from './init'
import { FiltersPlugin } from './plugins/filters'
import { HttpClientPlugin } from './plugins/httpClient'
import { SocketPlugin } from './plugins/socketClient'
import store from './store'
import { InitConfig } from './store/config/types'
import router from './router'
import { GpioSocketTemplate } from './gpio/gpioSocketTemplate'


Vue.config.productionTip = false


Vue.use(FiltersPlugin)
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
        createGpioSocketTemplate()
        Vue.$socket.connect(config.apiConfig.socketUrl)


        new Vue({
            store,
            router: router,
            render: h => h(App)
        }).$mount('#app')
    })
    .catch((e) => {
        consola.debug('Error attempting to init App:', e)
    })

function createGpioSocketTemplate() {
    console.log('Попытка создать сокет')
    const gpioSocket = new GpioSocketTemplate()
    gpioSocket.connect()
}
