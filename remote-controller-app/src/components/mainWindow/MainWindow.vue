<template>
    <div class="main-window-container">
        <FatalSelectList :items="listItems" v-if="listFlag" @close="closeList" @selectItem="selectItem" :zIndex="3" />
        <div class="header">
            <span class="time">
                {{ actualTime }}
            </span>
            <span class="state">
                Состояние: {{ localizedGornState }}
            </span>
            <span v-if="moduleWelderPowerState === 'unknown'" class="fatal-warning">NO SVAROCHNIK</span>
            <span v-if="!gpioSocketConnected" class="fatal-warning">NO GPIO</span>
        </div>
        <div class="center">
            <div class="weld-parameters">

                <div class="setting-buttons">
                    <div v-if="moduleWelderPowerState === 'on'" class="green-indicator">
                    </div>

                    <button class="parameter-button with-icon">
                        <div class="icon-wrapper">
                            <div class="a-icon">a</div>
                        </div>
                        <div class="button-info">
                            <span>{{ moduleVoltageDesired }}</span>
                            <div class="underline"></div>
                            <span>Напряжение желаемое, В</span>
                        </div>
                    </button>
                    <button class="parameter-button with-icon">
                        <div class="icon-wrapper">
                            <div class="b-icon">b</div>
                        </div>
                        <div class="button-info">
                            <span>{{ moduleCurrentDesired }}</span>
                            <div class="underline"></div>
                            <span>Ток желаемый, А</span>
                        </div>
                    </button>
                </div>
                <div class="fact-buttons">
                    <div v-if="moduleWelderPowerState !== 'on'" class="red-indicator">
                    </div>
                    <button class="parameter-button with-icon">
                        <div class="icon-wrapper">
                        </div>
                        <div class="button-info">
                            <span> {{ moduleVoltageFact }} ({{ moduleVoltageSetting }})</span>
                            <!-- <div class="underline"></div> -->
                            <span>Напряжение факт. (уст.), В</span>
                        </div>
                    </button>
                    <button @click="clickHandler" class="parameter-button with-icon">
                        <div class="icon-wrapper">
                        </div>
                        <div class="button-info">
                            <span>{{ moduleCurrentFact }} ({{ moduleCurrentSetting }})</span>
                            <!-- <div class="underline"></div> -->
                            <span>Ток факт. (уст.), А</span>
                        </div>
                    </button>
                </div>

            </div>
            <!-- <div class="buttons">
                <div @click="gornOn" class="setup-button-wrapper">
                    <button class="setup-button">Включить сварочник</button>
                </div>
                <div @click="gornOff" class="setup-button-wrapper">
                    <button class="setup-button">Выключить сварочник</button>
                </div>
                <div @click="openList" class="setup-button-wrapper">
                    <button class="setup-button">Другое...</button>
                </div>
            </div> -->
        </div>
        <div class="footer">
            <div @click="prevModule" class="setup-button-wrapper" :class="{ 'deactive': !isAllowPrevModule() }">
                <button class="setup-button">&lt;&lt;</button>
            </div>
            <div class="module-div">
                <span class="unit-name">{{ `Модуль ${moduleNumber}` }}</span>
                <span class="unit-params">{{ moduleParamsString }}</span>
            </div>
            <div @click="nextModule" class="setup-button-wrapper" :class="{ 'deactive': !isAllowNextModule() }">
                <button class="setup-button">&gt;&gt;</button>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import GpioMixin from '@/mixins/gpio';
import StateMixin from '@/mixins/state';
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers';
import { AlertType, InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { NetworkState, SystemInfo } from '@/store/server/types';
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
import FatalSelectList from '@/components/alerts/FatalSelectList.vue'
import ServicesMixin from '@/mixins/services';
import { GornClientState, GornServerState, UnitClientState, UnitServerState } from '@/store/ourExtension/gorn/types';

@Component({
    components: {
        FatalSelectList
    },
})
export default class MainWindow extends Mixins(StateMixin, GpioMixin, ServicesMixin) {
    listItems = ['Фикс сетeвого адреса', 'Выключить копухтер', 'Перезагрузить компухтер', 'Перезагрузить Klipper', 'FIRMWARE RESTART', 'Обновить страницу']
    listFlag = false
    longTouchTimeout: null | number = null
    firstStateLoadingFlag = true
    moduleNumber = 1


    get totalModules() {
        return this.$store.getters['ourExtension/gorn/getTotalModulesCount']
    }

    get currentModuleServerState(): UnitServerState | undefined {
        if (this.gornServerState && this.gornServerState[`unit_${this.moduleNumber}`]) {
            return this.gornServerState[`unit_${this.moduleNumber}`]
        }
    }

    get currentModuleClientState(): UnitClientState | undefined {
        if (this.gornClientState && this.gornClientState[`unit_${this.moduleNumber}`]) {
            return this.gornClientState[`unit_${this.moduleNumber}`]
        }
    }

    get gornServerState(): GornServerState | undefined {
        return this.$store.getters['ourExtension/gorn/getGornServerState']
    }

    get gornClientState(): GornClientState | undefined {
        return this.$store.getters['ourExtension/gorn/getGornClientState']
    }

    get moduleParamsString(): string {
        return `${this.moduleVoltageMax}В x ${this.moduleCurrentMax}А`
    }

    get actualTime(): string {
        return this.$store.getters['ourExtension/layoutsData/baseLayout/getActualTime']();
    }

    get printerState() {
        return this.$store.state.printer.printer
    }

    get gornState() {
        if (this.printerState && this.printerState.gorn_modbus) {
            return this.printerState.gorn_modbus
        }
    }

    get moduleVoltageDesired(): number | string {
        if (this.currentModuleClientState) {
            return this.currentModuleClientState.voltageDesired
        } else {
            return '?'
        }
    }

    set moduleVoltageDesired(newValue: number | string) { // Только number. Обман с any для компилятора
        if (this.currentModuleClientState) {
            const moduleState = this.currentModuleClientState as any
            moduleState.voltageDesired = newValue
        }
    }

    get moduleCurrentDesired(): number | string {
        if (this.currentModuleClientState) {
            const moduleState = this.currentModuleClientState as any
            return moduleState.currentDesired
        } else {
            return '?'
        }
    }

    set moduleCurrentDesired(newValue: number | string) {  // Только number. Обман с any для компилятора
        if (this.currentModuleClientState) {
            const moduleState = this.currentModuleClientState as any
            moduleState.currentDesired = newValue
        }
    }

    get moduleCurrentMax(): number | string {
        if (this.currentModuleServerState) {
            return this.currentModuleServerState.current_max
        } else {
            return '?'
        }
    }

    get moduleVoltageMax(): number | string {
        if (this.currentModuleServerState) {
            return this.currentModuleServerState.voltage_max
        } else {
            return '?'
        }
    }

    @Watch('gornState')
    gornStateWather() {
        if (this.firstStateLoadingFlag && this.gornState) {
            this.firstStateLoadingFlag = false
            this.$store.dispatch('ourExtension/gorn/refreshClientState')
        }
    }

    get moduleWelderPowerState() {
        if (this.currentModuleServerState) {
            return this.currentModuleServerState.state
        } else {
            return 'unknown'
        }
    }

    get moduleVoltageSetting() {
        if (this.currentModuleServerState) {
            return this.currentModuleServerState.voltage_setting
        } else {
            return '?'
        }
    }

    get moduleCurrentSetting() {
        if (this.currentModuleServerState) {
            return this.currentModuleServerState.current_setting
        } else {
            return '?'
        }
    }

    get moduleCurrentFact() {
        if (this.currentModuleServerState) {
            return this.currentModuleServerState.current_fact
        } else {
            return '?'
        }
    }

    get moduleVoltageFact() {
        if (this.currentModuleServerState) {
            return this.currentModuleServerState.voltage_fact
        } else {
            return '?'
        }
    }

    get localizedGornState() {
        switch (this.moduleWelderPowerState) {
            case 'unknown':
                return 'неизвестно'
            case 'master_power':
                return 'включено питание силовой части'
            case 'output_current':
                return 'включен выходной ток'
            case 'on':
                return 'сварочник включен'
            case 'off':
                return 'сварочник выключен'
        }
    }

    mounted() {
        window.addEventListener('touchstart', this.longTouchHandler)
        window.addEventListener('touchend', this.longTouchRejector)
    }

    isAllowNextModule() {
        const serverState = this.gornClientState
        const clientState = this.gornClientState
        if (serverState && clientState) {
            const newModule = this.moduleNumber + 1
            if (`unit_${newModule}` in serverState && `unit_${newModule}` in clientState) {
                return true
            }
        }
        return false
    }

    isAllowPrevModule() {
        const serverState = this.gornClientState
        const clientState = this.gornClientState
        if (serverState && clientState) {
            const newModule = this.moduleNumber - 1
            if (`unit_${newModule}` in serverState && `unit_${newModule}` in clientState) {
                return true
            }
        }
        return false
    }

    nextModule() {
        if (this.isAllowNextModule()) {
            this.moduleNumber++
        }
    }

    prevModule() {
        if (this.isAllowPrevModule()) {
            this.moduleNumber--
        }
    }

    longTouchHandler() {
        this.longTouchTimeout = setTimeout(() => {
            this.openList()
        }, 1000)
    }

    longTouchRejector() {
        if (this.longTouchTimeout) {
            clearTimeout(this.longTouchTimeout)
            this.longTouchTimeout = null
        }
    }

    gornOn(unit: number) {
        this.sendGcode(`GORN_ON unit=${unit}`)
    }

    gornOff(unit: number) {
        this.sendGcode(`GORN_OFF unit=${unit}`)
    }


    setNewVoltage() {
        if (this.moduleWelderPowerState === 'unknown') {
            const alert: InfoAlertType = {
                message: 'Состояние сварочника неизвестно! Запрос не отправлен!',
                type: 'red',
                time: 1500
            }
            Alerts.showInfoAlert(alert)
        } else if (this.moduleVoltageDesired === this.moduleVoltageSetting) {
            const alert: InfoAlertType = {
                message: 'Напряжения равны! Запрос не отправлен!',
                type: 'red',
                time: 1500
            }
            Alerts.showInfoAlert(alert)
        } else {
            const alert: InfoAlertType = {
                message: 'Отправлен запрос на изменение напряжения',
                type: 'green',
                time: 1500
            }
            Alerts.showInfoAlert(alert)
            this.sendGcode(`set_weld_parameters voltage=${this.moduleVoltageDesired} unit=${this.moduleNumber}`)
        }
    }

    setNewCurrent() {
        if (this.moduleWelderPowerState === 'unknown') {
            const alert: InfoAlertType = {
                message: 'Состояние сварочника неизвестно! Запрос не отправлен!',
                type: 'red',
                time: 1500
            }
            Alerts.showInfoAlert(alert)
        } else if (this.moduleCurrentDesired === this.moduleCurrentSetting) {
            const alert: InfoAlertType = {
                message: 'Токи равны! Запрос не отправлен!',
                type: 'red',
                time: 1500
            }
            Alerts.showInfoAlert(alert)
        } else {
            const alert: InfoAlertType = {
                message: 'Отправлен запрос на изменение тока',
                type: 'green',
                time: 1500
            }
            Alerts.showInfoAlert(alert)
            this.sendGcode(`set_weld_parameters current=${this.moduleCurrentDesired} unit=${this.moduleNumber}`)
        }
    }

    voltageValuesChecks(max: boolean): boolean {
        if (this.moduleVoltageDesired === '?' || typeof this.moduleVoltageDesired !== 'number') {
            const alert: InfoAlertType = {
                message: 'Ошибка! Что-то пошло не так',
                type: 'red',
                time: 1500
            }
            Alerts.showInfoAlert(alert)
            return false
        }
        if (max) {
            const maxValue = this.moduleVoltageMax
            if (maxValue === '?' || typeof maxValue !== 'number') {
                const alert: InfoAlertType = {
                    message: 'Ошибка! Неизвестно максимальное значение напряжения',
                    type: 'red',
                    time: 1500
                }
                Alerts.showInfoAlert(alert)
                return false
            } else if (this.moduleVoltageDesired + 1 > maxValue) {
                const alert: InfoAlertType = {
                    message: 'Достигнуто максимальное значение напряжения!',
                    type: 'red',
                    time: 1500
                }
                Alerts.showInfoAlert(alert)
                return false
            }
        } else {
            if (this.moduleVoltageDesired - 1 < 0) {
                const alert: InfoAlertType = {
                    message: 'Достигнуто минимальное значение напряжения!',
                    type: 'red',
                    time: 1500
                }
                Alerts.showInfoAlert(alert)
                return false
            }
        }
        return true
    }

    voltagePlus() {
        if (this.voltageValuesChecks(true)) {
            if (typeof this.moduleVoltageDesired === 'number') {
                this.moduleVoltageDesired += 1
            }
        }
    }

    voltageMinus() {
        if (this.voltageValuesChecks(false)) {
            if (typeof this.moduleVoltageDesired === 'number') {
                this.moduleVoltageDesired -= 1
            }
        }
    }

    currentValuesChecks(max: boolean): boolean {
        if (this.moduleCurrentDesired === '?' || typeof this.moduleCurrentDesired !== 'number') {
            const alert: InfoAlertType = {
                message: 'Ошибка! Что-то пошло не так',
                type: 'red',
                time: 1500
            }
            Alerts.showInfoAlert(alert)
            return false
        }
        if (max) {
            const maxValue = this.moduleCurrentMax
            if (maxValue === '?' || typeof maxValue !== 'number') {
                const alert: InfoAlertType = {
                    message: 'Ошибка! Неизвестно максимальное значение тока',
                    type: 'red',
                    time: 1500
                }
                Alerts.showInfoAlert(alert)
                return false
            } else if (this.moduleCurrentDesired + 1 > maxValue) {
                const alert: InfoAlertType = {
                    message: 'Достигнуто максимальное значение тока!',
                    type: 'red',
                    time: 1500
                }
                Alerts.showInfoAlert(alert)
                return false
            }
        } else {
            if (this.moduleCurrentDesired - 1 < 0) {
                const alert: InfoAlertType = {
                    message: 'Достигнуто минимальное значение тока!',
                    type: 'red',
                    time: 1500
                }
                Alerts.showInfoAlert(alert)
                return false
            }
        }
        return true
    }

    currentPlus() {
        if (this.currentValuesChecks(true)) {
            if (typeof this.moduleCurrentDesired === 'number') {
                this.moduleCurrentDesired += 1
            }
        }
    }

    currentMinus() {
        if (this.currentValuesChecks(false)) {
            if (typeof this.moduleCurrentDesired === 'number') {
                this.moduleCurrentDesired -= 1
            }
        }
    }

    offModules(units: number[]) {
        for (const unit of units) {
            this.gornOff(unit)
        }
    }

    onModules(units: number[]) {
        for (const unit of units) {
            this.gornOn(unit)
        }
    }

    tryToSwitchGorn() {
        let alert: InfoAlertType
        const allowedToOn = []
        const unknown = []
        const allowedToOff = []
        if (this.totalModules >= 1 && this.gornServerState) {
            for (const module in this.gornServerState) {
                if (this.gornServerState[module].state) {
                    const moduleNumber = this.gornServerState[module].unit
                    switch (this.gornServerState[module].state) {
                        case 'unknown':
                            unknown.push(moduleNumber)
                            break;
                        case 'off':
                            allowedToOn.push(moduleNumber)
                            break;
                        default:
                            allowedToOff.push(moduleNumber)
                            break;
                    }
                }
            }
            if (allowedToOff.length) {
                this.offModules(allowedToOff)
                let message = `Запрос на выключение модулей: ${allowedToOff.map((item) => { return `№${item} ` })}`
                if (unknown.length) {
                    message = `Запрос на выключение модулей: ${allowedToOff.map((item) => { return `№${item} ` })}. Проигнорированы модули: ${unknown.map((item) => { return `№${item} ` })} (Состояние неизвестно)`
                }
                alert = {
                    message: message,
                    type: 'green'
                }
                Alerts.showInfoAlert(alert)
            } else if (allowedToOn.length) {
                this.onModules(allowedToOn)
                let message = `Запрос на включение модулей: ${allowedToOn.map((item) => { return `№${item} ` })}`
                if (unknown.length) {
                    message = `Запрос на включение модулей: ${allowedToOn.map((item) => { return `№${item} ` })}. Проигнорированы модули: ${unknown.map((item) => { return `№${item} ` })} (Состояние неизвестно)`
                }
                alert = {
                    message: message,
                    type: 'green'
                }
                Alerts.showInfoAlert(alert)
            } else {
                alert = {
                    message: `Состояние модулей (${unknown.map((item) => { return `№${item} ` })}) неизвестно. Запрос не отправлен`,
                    type: 'red'
                }
                Alerts.showInfoAlert(alert)
            }
        } else {
            alert = {
                message: 'Не найдены сварочные модули. Запрос не отправлен',
                type: 'red'
            }
            Alerts.showInfoAlert(alert)
        }
    }

    @Watch('isFirstButtonPressed')
    firstButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isFirstButtonPressed
        if (!isPressed) {
            this.tryToSwitchGorn()
        }
    }

    @Watch('isSecondButtonPressed')
    secondButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isSecondButtonPressed
        if (!isPressed) {
            this.setNewVoltage()
        }
    }

    @Watch('isThirdButtonPressed')
    thirdButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isThirdButtonPressed
        if (!isPressed) {
            this.setNewCurrent()
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

    closeList() {
        this.listFlag = false

    }

    unitAddressFix() {
        const alert: AlertType = {
            message: 'Отключите порт от первого модуля. Включите порт ко второму модулю. Если все готово, нажмите "ДА"',
            type: 'yes_no',
            confirmCallback: this.sendUnitAddressFix
        }
        this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
    }

    sendUnitAddressFix() {
        const alert: InfoAlertType = {
            message: 'Отправлен запрос на смену сетевого адреса',
            type: 'green',
            time: 2000
        }
        Alerts.showInfoAlert(alert)
        this.sendGcode('SET_NEW_UNIT_ADDRESS unit=1 new_unit=2')
    }

    selectItem(selectedItem: string) {
        this.closeList()
        switch (selectedItem) {
            case this.listItems[0]:
                this.unitAddressFix()
                break;
            case this.listItems[1]:
                this.hostShutdown()
                break;
            case this.listItems[2]:
                this.hostReboot()
                break;
            case this.listItems[3]:
                this.restartKlipper()
                break;
            case this.listItems[4]:
                this.restartFirmware()
                break;
            case this.listItems[5]:
                this.restartInterface()
                break;
        }
    }

    restartKlipper() {
        this.serviceRestartKlipper()
        const alert: InfoAlertType = {
            message: 'Отправлен запрос на перезагрузку Klipper',
            type: 'green'
        }
        Alerts.showInfoAlert(alert)
    }

    restartFirmware() {
        this.firmwareRestartKlippy()
        const alert: InfoAlertType = {
            message: 'Отправлен запрос на перезагрузку прошивки',
            type: 'green'
        }
        Alerts.showInfoAlert(alert)
    }

    restartMoonraker() {
        this.serviceRestartMoonraker()
        const alert: InfoAlertType = {
            message: 'Отправлен запрос на перезагрузку Moonraker',
            type: 'green'
        }
        Alerts.showInfoAlert(alert)
    }

    restartInterface() {
        location.reload()
    }

    openList() {
        this.listFlag = true
    }

    clickHandler() {
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
}
</script>

<style lang="scss">
@import './main_window.scss';
</style>