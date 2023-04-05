/* eslint-disable lines-between-class-members */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */

/**
 * Taken from https://github.com/DimanVorosh/vue-json-rpc-websocket/blob/master/src/wsClient.js
 * and refactored.
 */
import _Vue from 'vue'
import consola from 'consola'
import { camelCase } from 'lodash-es'
import { httpClientActions } from '@/fluiddExtension/api/httpClientActions'
import deepMerge from 'deepmerge'
import { Globals } from '../fluiddGlobals'

export class WebSocketClient {
  url = ''
  connection: WebSocket | null = null
  reconnectEnabled = false
  reconnectInterval = 1000
  allowedReconnectAttempts = 3
  reconnectCount = 0
  logPrefix = '[WEBSOCKET]'
  requests: Array<Request> = []
  store: any | null = null
  pingTimeout: any
  cache: CachedParams | null = null

  constructor (options: Options) {
    this.url = options.url
    this.reconnectEnabled = options.reconnectEnabled || false
    this.reconnectInterval = options.reconnectInterval || 1000
    this.store = options.store ? options.store : null
  }

  pong () {
    // Valid response from the socket.
    clearTimeout(this.pingTimeout)

    // We have a connection again, so set the socket properties
    // appropriately.
    if (
      !this.store.state.socket.disconnecting && // We arent about to disonnect and..
      !this.store.state.files.download // We're not in the middle of a download.
    ) {
      this.store.commit('fluiddExtension/socket/setSocketOpen', true)
      this.store.dispatch('fluiddExtension/socket/onSocketConnecting', false)
    }

    this.pingTimeout = setTimeout(() => {
      if (
        !this.store.state.socket.disconnecting && // We arent about to disonnect and..
        !this.store.state.files.download // We're not in the middle of a download.
      ) {
        // In the event our socket stops responding, set the socket properties
        // appropriately.
        consola.debug(`${this.logPrefix} Connection timeout, pong failed`)
        if (this.store) this.store.commit('fluiddExtension/socket/setSocketOpen', false)
        if (this.store) this.store.dispatch('fluiddExtension/socket/onSocketConnecting', true)
      }
    }, Globals.SOCKET_PING_INTERVAL)
  }

  close () {
    if (this.connection) {
      this.cache = null
      this.connection.close()
      this.reconnectCount = 0
    }
  }

  async connect (url?: string) {
    if (url) this.url = url
    this.cache = null

    await httpClientActions.accessOneshotTokenGet()
      .then(response => response.data.result)
      .then(token => {
        // Good. Move on with setting up the socket.
        if (this.store) this.store.dispatch('fluiddExtension/socket/onSocketConnecting', true)
        this.connection = new WebSocket(`${this.url}?token=${token}`)

        this.connection.onopen = () => {
          if (this.reconnectEnabled) {
            this.reconnectCount = 1
          }
          if (this.store) {
            this.store.dispatch('fluiddExtension/socket/onSocketConnecting', false)
            this.store.dispatch('fluiddExtension/socket/onSocketOpen', true)
          }
        }

        this.connection.onclose = (e) => {
          consola.debug(`${this.logPrefix} Connection closed:`, e)
          clearTimeout(this.pingTimeout)
          if (this.store) this.store.dispatch('fluiddExtension/socket/onSocketClose', e)
          if (!e.wasClean) {
            this.reconnect()
          }
        }

        this.connection.onerror = (e) => {
          consola.error(`${this.logPrefix} Connection error:`, e)
          if (this.store) this.store.dispatch('fluiddExtension/socket/onSocketError', e)
        }

        this.connection.onmessage = (m) => {  // Листенер получения ответа от сервера
          // Parse the data packet.
          const d: SocketResponse = JSON.parse(m.data)  // 1. d - json ответа от сервера

          // Is this a socket notification, or an answer to a specific request?
          let request: Request | undefined  // 2. Тут будет запрос, ответ на который пришел
          const requestIndex = this.requests.findIndex(request => request.id === d.id)  // 3. Поиск id request по id из ответа
          if (requestIndex > -1) {
            request = this.requests[requestIndex]
            this.requests.splice(requestIndex, 1)  // 4. Удаление request из листа запросов
          }

          // Remove a wait if defined.
          if (this.store && request && request.wait && request.wait.length) {  // 5. Видимо удаление лоадера. Посмотреть что это
            this.store.commit('fluiddExtension/wait/setRemoveWait', request.wait)
          }

          if (d.error) { // Is it in error?  // 6. Если ошибка
            if (request) {
              Object.defineProperty(d.error, '__request__', { enumerable: false, value: request })  // хз нафига это
            }
            consola.debug(`${this.logPrefix} Response error:`, d.error)
            if (this.store) this.store.dispatch('fluiddExtension/socket/onSocketError', d.error)  //TODO: Посмотреть, что происходит при ошибке
            return
          }

          // we're still alive.
          this.pong()  // TODO:Видимо установка флагов, что сервер может принимать запросы

          if (request) {
            // these are specific answers to a request we've made.
            // Build the response, including a non-enumerable ref of the original request.
            let result = (d.result) ? d.result : d.params  // 7. Тут хранится JSON тела результата
            if (typeof result === 'string') {
              result = { result }
            }

            Object.defineProperty(result, '__request__', { enumerable: false, value: request })  // TODO: попытаться понять зачем это
            consola.debug(`${this.logPrefix} Response:`, result)
            if (request.dispatch && this.store) this.store?.dispatch(request.dispatch, result)  // 8. Выполнение action и mutation, переданных с запросом 
            if (request.commit && this.store) this.store?.commit(request.commit, result)
          } else {  // 9. Видимо, если сокет нам что-то прислал, но не в качестве ответа
            // These are socket notifications (i.e., no specific request was made..)
            // Dispatch with the name of the method, converted to camelCase.

            if (d.params && d.params[0]) {
              const [params, eventtime] = d.params

              if (d.method !== 'notify_status_update') {
                // Normally, we let notifications through with no cache...
                if (this.store) this.store.dispatch('fluiddExtension/socket/' + camelCase(d.method), params)
              } else {
                // ...However, status notifications come through thick and fast,
                // so we cache these and send them through every second.

                // If any of these properties exist, bypass the cache and send immediately
                for (const key of ['motion_report']) {
                  if (this.store && key in params) {
                    // this.store.dispatch('printer/onFastNotifyStatusUpdate', { key, payload: params[key] }, { root: true })  //TODO:
                    delete params[key]
                  }
                }

                const timestamp = eventtime ? eventtime * 1000 : Date.now()

                this.cache = (!this.cache)
                  ? { timestamp, params }
                  : { timestamp: this.cache.timestamp, params: deepMerge(this.cache.params, params, { arrayMerge: (_, y) => y }) }

                // If there's a second or more difference, flush the cache.
                if (timestamp - this.cache.timestamp >= 1000) {
                  if (this.store) this.store.dispatch('fluiddExtension/socket/' + camelCase(d.method), this.cache.params)
                  this.cache = { timestamp, params: {} }
                }
              }
            } else {
              // No params? Let it through.
              if (this.store) this.store.dispatch('fluiddExtension/socket/' + camelCase(d.method))
            }
          }
        }
      })
      .catch((err) => {
        // Bad. If this is a 401, then don't retry. Otherwise do.
        if (err.response?.status !== 401) this.reconnect()
      })
  }

  reconnect () {
    if (this.reconnectCount <= this.allowedReconnectAttempts) {
      this.reconnectCount += 1
      this.connection = null
      consola.debug(`${this.logPrefix} Reconnecting in ${this.reconnectInterval}`)
      setTimeout(() => {
        this.connect()
      }, this.reconnectInterval)
    } else {
      if (this.store) this.store.dispatch('fluiddExtension/socket/onSocketConnecting', false)
    }
  }

  /**
   * Sends data TO the socket
   * @param method
   * @param params
   */
  emit (method: string, options?: NotifyOptions) {
    if (this.store.state.socket.disconnecting || this.store.state.socket.connecting) {  // 1. Проверка на коннект
      consola.debug(`${this.logPrefix} Socket emit denied, in disconnecting state:`, method, options)

      return
    }

    if (this.connection?.readyState === WebSocket.OPEN) {  // 2. Еще одна проверка на коннект
      // moonraker expects a unique id for us to reference back to when data is returned.
      const getRandomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min
      }
      const id = getRandomNumber(10000, 99999)  // 3. Уникальный id, необходимый для поиска ответа
      const packet: SocketRequest = {
        id,
        method,
        jsonrpc: '2.0'
      }
      const request: Request = {
        id
      }
      if (options && options.wait) {  // option.wait - какая-то стринга из global.ts
        request.wait = options.wait
        if (this.store) this.store.dispatch('wait/addWait', options.wait)  // 4. action ожидания. TODO: Посмотреть что это
      }
      if (options && options.params) {  // 5. Перемещение параметров запроса в packet и request
        packet.params = options.params
        request.params = options.params
      }
      if (options && options.dispatch) request.dispatch = options.dispatch  // 6. Перемещение dispatch и commit в request
      if (options && options.commit) request.commit = options.commit
      this.requests.push(request)  // 7. Добавление в лист request {id, wait, params, dispatch, commit}
      this.connection.send(JSON.stringify(packet))  // 8. Отправка на сервер packed ({id, method, params})
    } else {
      consola.debug(`${this.logPrefix} Not ready, or closed.`, method, options, this.connection?.readyState)
    }
  }
}


interface Options {
  url: string;
  token?: string;
  reconnectEnabled?: boolean;
  reconnectInterval?: number;
  store: any;
}

export interface NotifyOptions {
  params?: any;
  dispatch?: string;
  commit?: string;
  wait?: string;
}

interface Request {
  id: number;
  dispatch?: string;
  commit?: string;
  params?: any;
  wait?: string;
}

interface SocketRequest {
  jsonrpc: string;
  id: number;
  method: string;
  params?: any;
}

interface SocketResponse {
  jsonrpc: string; // always available
  method?: string; // generic responses
  params?: [any, number?]; // generic responses
  id?: number; // specific response
  result?: any; // specific response
  error?: string | SocketError; // specific response
}

interface SocketError {
  code: number;
  message: string;
}

interface CachedParams {
  timestamp: number;
  params: any;
}
