import { createApp } from 'vue'
import App from './App.vue'
import { HttpClient } from './fluiddExtension/clients/httpClient'
import { WebSocketClient } from './fluiddExtension/clients/socketClient'
import store from './store'
import { Globals } from './fluiddExtension/fluiddGlobals'

export const httpClient = HttpClient(store);
export const socketClient = new WebSocketClient({
    url: "localhost:8088",
    reconnectEnabled: true,
    reconnectInterval: Globals.SOCKET_RETRY_DELAY,
    store
  })


export const app = createApp(App)
app.use(store)
app.mount('#app')
console.log(store)

socketClient.connect();

