<template>
    <div class="main-window-container">
        <div class="header">
            <span>
                {{ actualTime }}
            </span>
        </div>
        <div class="center">
            <div class="setting-buttons">
                <div class="green-indicator">
                </div>

                <button class="parameter-button with-icon">
                    <div class="icon-wrapper">
                        <div class="a-icon">a</div>
                    </div>
                    <div class="button-info">
                        <span>{{ voltageSetting }}</span>
                        <div class="underline"></div>
                        <span>Напряжение уст., В</span>
                    </div>
                </button>
                <button class="parameter-button with-icon">
                    <div class="icon-wrapper">
                        <div class="b-icon">b</div>
                    </div>
                    <div class="button-info">
                        <span>{{ currentSetting }}</span>
                        <div class="underline"></div>
                        <span>Ток уст., А</span>
                    </div>
                </button>
            </div>
            <div class="fact-buttons">
                <div class="red-indicator">
                </div>
                <button @click="cmdTest" class="parameter-button with-icon">
                    <div class="icon-wrapper">
                    </div>
                    <div class="button-info">
                        <span>{{ voltageRead }}</span>
                        <!-- <div class="underline"></div> -->
                        <span>Напряжение факт., В</span>
                    </div>
                </button>
                <button @click="clickHandler" class="parameter-button with-icon">
                    <div class="icon-wrapper">
                    </div>
                    <div class="button-info">
                        <span>{{ currentRead }}</span>
                        <!-- <div class="underline"></div> -->
                        <span>Ток факт., А</span>
                    </div>
                </button>
            </div>
        </div>
        <div class="footer"></div>
    </div>
</template>


<script lang="ts">
import GpioMixin from '@/mixins/gpio';
import StateMixin from '@/mixins/state';
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers';
import { InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { NetworkState, SystemInfo } from '@/store/server/types';
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class MainWindow extends Mixins(StateMixin, GpioMixin) {
    voltageSetting = 0
    currentSetting = 0

    get actualTime(): string {
        return this.$store.getters['ourExtension/layoutsData/baseLayout/getActualTime']();
    }

    get plasmaModbusState() {
        return this.$store.state.printer.printer.plasma_modbus
    }

    get voltageSp() {
        if (this.plasmaModbusState) {
            let voltageSp = this.plasmaModbusState.voltage_sp
            if (typeof voltageSp === 'undefined') {
                voltageSp = 0
            }
            return voltageSp
        } else {
            return 0
        }
    }

    get currentSp() {
        if (this.plasmaModbusState) {
            let currentSp = this.plasmaModbusState.current_sp
            if (typeof currentSp === 'undefined') {
                currentSp = 0
            }
            return currentSp
        } else {
            return 0
        }
    }

    get voltageRead() {
        if (this.plasmaModbusState) {
            let voltageRead = this.plasmaModbusState.voltage_read
            if (typeof voltageRead === 'undefined') {
                voltageRead = 0
            }
            return voltageRead
        } else {
            return 0
        }
    }

    get currentRead() {
        if (this.plasmaModbusState) {
            let currentRead = this.plasmaModbusState.current_read
            if (typeof currentRead === 'undefined') {
                currentRead = 0
            }
            return currentRead
        } else {
            return 0
        }
    }

    voltagePlus() {
        this.voltageSetting += 1
    }

    voltageMinus() {
        this.voltageSetting -= 1
    }

    currentPlus() {
        this.currentSetting += 1
    }

    currentMinus() {
        this.currentSetting -= 1
    }

    @Watch('isFirstButtonPressed')
    firstButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isFirstButtonPressed
        if (!isPressed) {
            const alert: InfoAlertType = {
                message: 'Нажата 1 кнопка',
                type: 'green'
            }
            Alerts.showInfoAlert(alert)
        }
    }

    @Watch('isSecondButtonPressed')
    secondButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isSecondButtonPressed
        if (!isPressed) {
            const alert: InfoAlertType = {
                message: 'Нажата 2 кнопка',
                type: 'green'
            }
            Alerts.showInfoAlert(alert)
        }
    }

    @Watch('isThirdButtonPressed')
    thirdButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isThirdButtonPressed
        if (!isPressed) {
            const alert: InfoAlertType = {
                message: 'Нажата 3 кнопка',
                type: 'green'
            }
            Alerts.showInfoAlert(alert)
        }
    }

    @Watch('encoder1State')
    encoder1Watcher() {
        if (this.encoder1State.emited) {
            if (this.encoder1State.isClockwise) {
                this.voltagePlus()
            } else {
                this.voltageMinus()
            }
        }
    }

    @Watch('encoder2State')
    encoder2Watcher() {
        if (this.encoder2State.emited) {
            if (this.encoder2State.isClockwise) {
                this.currentPlus()
            } else {
                this.currentMinus()
            }
        }
    }

    clickHandler() {
        console.log(this.$store.state.printer.printer.plasma_modbus)
        console.log(this.$store.state.printer.printer.gorn)
        const systemInfo = this.$store.getters['server/getSystemInfo'] as SystemInfo
        if (systemInfo && systemInfo.network) {
            const ipAdresses = this.getIpAddresses(systemInfo.network)
            if (ipAdresses.length) {
                const alert: InfoAlertType = {
                    message: `Возможные ip-адреса: ${ipAdresses}`,
                    type: 'green',
                }
                Alerts.showInfoAlert(alert)
            } else {
                this.noNetworkAlert()
            }
        } else {
            this.noNetworkAlert()
        }
        console.log(this.$store.getters['server/getSystemInfo'])

    }

    noNetworkAlert() {
        const alert: InfoAlertType = {
            message: 'Сеть не найдена',
            type: 'red',
            time: 2000
        }
        Alerts.showInfoAlert(alert)
    }

    getIpAddresses(networkObj: NetworkState): string[] {
        const ipAdrresses = []
        for (const id in networkObj) {
            const network = networkObj[id]
            if (network.ip_addresses) {
                for (const addr of network.ip_addresses) {
                    if (addr.address && addr.address.startsWith('192')) {
                        ipAdrresses.push(addr.address)
                    }
                }
            }
        }
        return ipAdrresses
    }

    cmdTest() {
        this.sendGcode('TEST_COMMAND voltage=10 current=2')
    }
}
</script>

<style lang="scss">
@import './main_window.scss';
</style>