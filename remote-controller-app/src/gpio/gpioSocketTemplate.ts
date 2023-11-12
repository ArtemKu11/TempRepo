import { SocketRequest } from "@/plugins/socketClient"
import { Store } from "vuex"

export class GpioSocketTemplate {
    connection: WebSocket | null = null
    url = 'ws://localhost:8125'
    reconnectingTimeout = 1000
    debug = false

    connect() {
        // GpioBus.$emit({ buttonNumber: 1, type: 'up' })

        this.connection = new WebSocket(this.url)

        this.connection.onopen = () => {
            console.log('GPIO socket open')
            // Кинуть Alerts.showInfoAlert
        }

        this.connection.onclose = (e) => {
            if (this.debug) { console.log('СОКЕТ ЗАКРЫТ ', e) }
            // Кинуть Alerts.showInfoAlert
            setTimeout(this.connect.bind(this), this.reconnectingTimeout)
        }

        this.connection.onerror = (e) => {
            if (this.debug) { console.log('ОШИБКА СОКЕТА ', e) }
        }

        this.connection.onmessage = (m) => {
            const response = m as any
            if (response.data) {  // TODO, если не data
                const data = JSON.parse(response.data)
                console.log('ОТ СОКЕТА:', data)  // Тут будет GpioBus.$emit()
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
}