import { SocketRequest } from "@/plugins/socketClient"
import { EncoderState } from "@/store/ourExtension/gpio/types"
import { Alerts } from "@/store/ourExtension/layoutsData/alerts/helpers"
import { AlertType } from "@/store/ourExtension/layoutsData/alerts/types"
import { Store } from "vuex"

export class GpioSocket {
    connection: WebSocket | null = null
    // url = 'ws://192.168.1.113:8125'
    url = 'ws://localhost:8125'
    reconnectingTimeout = 1000
    debug = false
    stateTimeout: number | null = null
    store: Store<any>
    buttonsCommits = new Map([
        [1, 'ourExtension/gpio/setFirstButton'],
        [2, 'ourExtension/gpio/setSecondButton'],
        [3, 'ourExtension/gpio/setThirdButton'],
        [4, 'ourExtension/gpio/setFourthButton'],
        [5, 'ourExtension/gpio/setFifthButton'],
        [6, 'ourExtension/gpio/setSixthButton'],])
    encodersCommits = new Map([
        [1, 'ourExtension/gpio/setEncoder1'],
        [2, 'ourExtension/gpio/setEncoder2']
    ])

    constructor(store: Store<any>) {
        this.store = store
    }

    connect() {
        this.connection = new WebSocket(this.url)

        this.connection.onopen = () => {
            console.log('GPIO socket open')
            this.store.commit('ourExtension/gpio/setSocketConnected', true)
        }

        this.connection.onclose = (e) => {
            if (this.debug) { console.log('СОКЕТ ЗАКРЫТ ', e) }
            this.store.commit('ourExtension/gpio/setSocketConnected', false)
            setTimeout(this.connect.bind(this), this.reconnectingTimeout)
        }

        this.connection.onerror = (e) => {
            if (this.debug) { console.log('ОШИБКА СОКЕТА ', e) }
        }

        this.connection.onmessage = (m) => {
            const response = m as any
            if (response.data) {  // TODO, если не data
                const data = JSON.parse(response.data)
                if (data.result) {  // TODO, если не ressult
                    if (data.result.event_type) {  // TODO, если id
                        if (data.result.event_type === "button_event") {  // TODO, энкодер
                            const buttonEvent = data.result as ButtonEvent
                            this.handleButtonEvent(buttonEvent)
                        } else if (data.result.event_type === "encoder_event") {
                            const encoderEvent = data.result as EncoderEvent
                            this.handleEncoderEvent(encoderEvent)
                        }
                    }
                }
            }
        }
    }

    emit() {
        if (this.connection?.readyState === WebSocket.OPEN) {
            const getRandomNumber = (min: number, max: number) => {
                return Math.floor(Math.random() * (max - min + 1)) + min
            }
            const id = getRandomNumber(10000, 99999)
            const packet: SocketRequest = {
                id: id,
                method: 'test_method',
                jsonrpc: '2.0'
            }
            this.connection.send(JSON.stringify(packet))
            console.log('Отправлен пакет')
        } else {
            console.log('Ошибка отправки. Сокет не открыт')
        }
    }

    handleButtonEvent(buttonEvent: ButtonEvent) {
        const buttonNumber = buttonEvent.button_number
        const commit = this.buttonsCommits.get(buttonNumber)
        if (!commit) {
            const alert: AlertType = {
                message: "Неизвестный запрос с сервера на кнопку: " + buttonNumber,
                type: 'red'
            }
            Alerts.showInfoAlert(alert)
        } else {
            if (buttonEvent.type === 'both') {
                this.handleButtonBothEvent(commit)
                return;
            }
            let isPressed = false
            if (buttonEvent.type === 'key_down') {
                isPressed = true
            }
            this.store.commit(commit, isPressed)
        }

    }

    handleButtonBothEvent(commit: string) {
        this.store.commit(commit, true)
        setTimeout(() => {
            this.store.commit(commit, false)
        }, 1)
    }

    handleEncoderEvent(encoderEvent: EncoderEvent) {
        const encoderNumber = encoderEvent.encoder_number
        const commit = this.encodersCommits.get(encoderNumber)
        let isClockwise = true
        if (encoderEvent.type === 'counter_clockwise') {
            isClockwise = false
        }
        if (commit) {
            const emitedEncoderState: EncoderState = {
                emited: true,
                isClockwise: isClockwise
            }
            this.store.commit(commit, emitedEncoderState)
            setTimeout(() => {
                const encoderState: EncoderState = {
                    emited: false,
                    isClockwise: isClockwise
                }
                this.store.commit(commit, encoderState)
            }, 1)

        } else {
            const alert: AlertType = {
                message: "Неизвестный запрос с сервера на энкодер: " + encoderNumber,
                type: 'red'
            }
            Alerts.showInfoAlert(alert)
        }
    }
}

interface ButtonEvent {
    event_type: string  // button_event
    type: string  // key_up, key_down
    button_number: number
}

interface EncoderEvent {
    event_type: string  // encoder_event
    type: string  // clockwise, counter_clockwise
    encoder_number: number
}