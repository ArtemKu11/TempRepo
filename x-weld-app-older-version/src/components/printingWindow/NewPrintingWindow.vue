<template>
    <div class="content-container new-print-window">
        <PrintSettings v-if="printSettingsFLag" />

        <div class="header">
            <div class="operation-and-warnings-container">
                <div class="operation-container">{{ localPrinterState }}...</div>
                <span v-if="warningFlag">WARNING</span>
                <span v-if="noGasFlag">NO GAS</span>
            </div>
            <div class="coordinates-container">
                <img src="@/layouts/new_print_layout/img/gorelka_logo.svg" />
                <span id="x-coords">{{ fixedCoordinatesHolder[0] }}</span>
                <span id="y-coords">{{ fixedCoordinatesHolder[1] }}</span>
                <span id="z-coords">{{ fixedCoordinatesHolder[2] }}</span>
            </div>
        </div>
        <div class="center">
            <div class="center-content">
                <div class="rejim">
                    <span>Параметры режима: </span>
                    <span>{{ printingDiapason.profile.name }}</span>
                </div>

                <div class="buttons-div">
                    <div class="print-params-buttons">
                        <div class="colorful-buttons">
                            <button @touchstart="parameterClickHandler('Ток, А', 'current', 1)" class="parameter-button">
                                <span>{{ current }}</span>
                                <div class="underline"></div>
                                <span>Ток, А</span>
                            </button>
                            <button @touchstart="parameterClickHandler('Напряжение, В', 'voltage', 1)" class="parameter-button">
                                <span>{{ voltage }}</span>
                                <div class="underline"></div>
                                <span>Напряжение, В</span>
                            </button>
                            <button @touchstart="parameterClickHandler('V подачи, м/мин', 'feedRate', 0.1)"
                                class="parameter-button">
                                <span>{{ feedRate }}</span>
                                <div class="underline"></div>
                                <span>V подачи, м/мин</span>
                            </button>
                        </div>

                        <span class="print-params-span">Параметры печати:</span>

                        <div class="usual-buttons">
                            <button @touchstart="listClickHandler('oscillationType')" class="parameter-button">
                                <div class="img-wrapper">
                                    <img src="@/layouts/new_print_layout/img/oscilation_logo.png" width="105" height="1">
                                </div>
                                <span>Тип: {{ oscillationType }}</span>
                            </button>
                            <button @touchstart="parameterClickHandler('V подачи, м/мин', 'weldingSpeed', 0.1)"
                                class="parameter-button">
                                <span>{{ weldingSpeed }}</span>
                                <span>V печати, м/мин</span>
                            </button>
                            <button @touchstart="parameterClickHandler('Сдвиг Z, мм', 'shift', 0.1)" class="parameter-button">
                                <span>{{ shift }}</span>
                                <span>Сдвиг Z, мм</span>
                            </button>
                        </div>
                    </div>
                    <div class="big-round-button-wrapper">
                        <button @touchstart="bigButtonHandler" class="big-round-button">
                            <img v-if="isPrinting" src="@/layouts/new_print_layout/img/pause_big.svg" alt="">
                            <img v-else src="@/layouts/new_print_layout/img/resume_big.svg">
                            <svg>
                                <defs>
                                    <linearGradient id="grad1">
                                        <stop offset="0%" stop-color="rgba(0, 178, 202, 1)" />
                                        <stop offset="100%" stop-color="rgba(4, 112, 200, 1)" stop-opacity="1" />
                                    </linearGradient>
                                </defs>
                                <circle ref="circleBar" transform="rotate(-90 152 152)" stroke-dasharray="814.4 0" cx="152"
                                    cy="152" r="130" stroke="url(#grad1)" stroke-width="7px" fill="transparent">
                                </circle>
                            </svg>
                        </button>
                    </div>

                </div>

                <div class="filename-div">
                    <span>{{ fileName }}</span>
                </div>

            </div>

            <div class="footer-content">
                <div class="print-info">
                    <div>
                        <img src="@/layouts/new_print_layout/img/height.svg">
                        <span>Высота, мм: 846</span>
                    </div>
                    <div>
                        <img src="@/layouts/new_print_layout/img/layers.svg">
                        <span>Слои: {{ printLayer }}/{{ file.layers }}</span>
                    </div>
                </div>
                <div class="small-buttons">
                    <button @touchstart="throwCancelPrintRequest" class="stop-button">

                    </button>

                    <button @touchstart="openPrintSettings" class="more-button">

                    </button>
                </div>
            </div>

        </div>
        <div class="footer"></div>
    </div>
</template>


<script lang="ts">
import { SocketActions } from '@/api/socketActions';
import StateMixin from '@/mixins/state';
import WindowsMixin from '@/mixins/windows';
import { FileData } from '@/store/ourExtension/files/types';
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers';
import { AlertType, InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { PrintingDiapasonForMoonraker, ProfilesMetadata } from '@/store/ourExtension/profiles/types';
import { Vue, Component, Mixins } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class NewPrintingWindow extends Mixins(WindowsMixin, StateMixin) {
    warningFlag = false
    noGasFlag = false
    processingSetter: string = ''

    mounted() {
        setTimeout(() => { this.setPrintProgress() }, 100)
    }

    setPrintProgress() {
        const progress = this.printProgress
        const circleBar = this.$refs.circleBar as SVGElement
        if (circleBar) {
            this.setPercent(progress, circleBar)
        }
    }

    setPercent(percent: number, circleBar: SVGElement) {
        const circleLength = 2 * Math.PI * 130
        const progressPercent = circleLength * percent / 100
        const probelPercent = circleLength - progressPercent
        circleBar.style.strokeDasharray = `${progressPercent} ${probelPercent}`
    }

    get isPrinting(): boolean {
        return this.printerState.toLowerCase() === 'printing'
    }

    get pause(): boolean {
        return this.printerState.toLowerCase() === 'paused'
    }


    get printProgress(): number {
        let progress = this.$store.getters['printer/getPrintProgress']
        progress = +(progress * 100).toFixed(0)
        const circleBar = this.$refs.circleBar as SVGElement
        if (circleBar) {
            this.setPercent(progress, circleBar)
        }
        return progress
    }

    get printLayer(): number {
        return this.$store.getters['printer/getPrintLayer']
    }

    get localPrinterState(): string {
        switch (this.printerState.toLowerCase()) {
            case 'loading':
                return 'Загрузка'
            case 'printing':
                return 'Печатается'
            case 'paused':
                return 'Приостановлено'
            case 'busy':
                return 'Принтер занят'
            case 'cancelled':
                return 'Отменено'
            case 'ready':
                return 'Готов к печати'
            case 'idle':
                return 'Бездействует'
            default:
                break;
        }
        return this.printerState.toLowerCase()
    }

    get file(): FileData {
        return this.$store.getters['ourExtension/layoutsData/printingWindow/getFile']()
    }

    get fileName(): string {
        let name = this.file.name
        if (name.length > 30) {
            name = name.slice(0, 30) + '...'
        }
        return name
    }

    get printSettingsFLag() {
        return this.$store.getters['ourExtension/windowFlags/getPrintSettingsWindowFlag']
    }

    get printingDiapason(): PrintingDiapasonForMoonraker {
        return this.$store.getters['ourExtension/layoutsData/printingWindow/getPrintingDiapason']()
    }

    get current(): number {
        return this.printingDiapason.profile.profileMainParameters.current
    }

    set current(newValue: number) {
        this.printingDiapason.profile.profileMainParameters.current = newValue
    }

    get voltage(): number {
        return this.printingDiapason.profile.profileMainParameters.voltage
    }

    set voltage(newValue: number) {
        this.printingDiapason.profile.profileMainParameters.voltage = newValue
    }

    get feedRate(): number {
        return this.printingDiapason.profile.profileMainParameters.feedRate
    }

    set feedRate(newValue: number) {
        this.printingDiapason.profile.profileMainParameters.feedRate = newValue
    }

    get oscillationType(): string {
        return this.printingDiapason.profile.profileOscilationParameters.type
    }

    set oscillationType(newValue: string) {
        this.printingDiapason.profile.profileOscilationParameters.type = newValue
    }

    get weldingSpeed(): number {
        return this.printingDiapason.profile.profileAdditionalParameters.weldingSpeed
    }

    set weldingSpeed(newValue: number) {
        this.printingDiapason.profile.profileAdditionalParameters.weldingSpeed = newValue
    }

    get shift(): number {
        return this.$store.getters['ourExtension/layoutsData/printingWindow/getShift']
    }

    set shift(newValue: number) {
        this.$store.state.ourExtension.layoutsData.printingWindow.shift = newValue
    }

    get profilesMetadata(): ProfilesMetadata {
        return this.$store.getters['ourExtension/profiles/getProfilesMetadata']
    }



    round(value: number) {
        return Math.round(+value * 10) / 10;
    }

    openPrintSettings() {
        this.$store.dispatch('ourExtension/windowFlags/openPrintSettingsWindow')
    }

    parameterClickHandler(parameterName: string, setter: string, valcoderStep: number) {
        let rejectPoint = true
        this.processingSetter = setter
        let initValue = 0
        if (setter in this) {
            const context = this as any
            initValue = context[setter]
        }
        const callback = this.newValueReceiver.bind(this)
        if (valcoderStep / valcoderStep !== 1) {
            rejectPoint = false
        }
        this.openInputWindow(false, parameterName, initValue, valcoderStep, 'void', callback, 2000, -2000, rejectPoint, '')
    }

    newValueReceiver(newValue: number) {
        if (this.processingSetter in this) {
            const context = this as any
            context[this.processingSetter] = newValue
        }
        this.processingSetter = ''
    }

    listClickHandler(setter: string) {
        let initList: string[] = []
        const callback = this.newStringValueReceiver.bind(this)
        if (setter === 'oscillationType') {
            initList = this.profilesMetadata.oscilationTypes
        }
        this.processingSetter = setter
        this.openSelectWindowWithoutIcon(callback, initList)
    }

    newStringValueReceiver(newValue: string) {
        if (this.processingSetter in this) {
            const context = this as any
            context[this.processingSetter] = newValue
        }
        this.processingSetter = ''
    }

    bigButtonHandler() {
        if (this.printerAllowedToStartPrint) {
            this.startPrintAlert()
            this.startPrint(this.file)
        } else if (this.printerState.toLowerCase() !== 'printing') {
            this.pauseAlert()
            this.pausePrint()
        } else {
            this.resumeAlert()
            this.resumePrint()
        }
    }

    clickHandler(buttonName: string) {
        switch (buttonName) {
            case 'resume':
                if (this.printerState.toLowerCase() === 'ready' || this.printerState.toLowerCase() === 'idle' || this.printerState.toLowerCase() === 'cancelled') {
                    this.startPrintAlert()
                    this.startPrint(this.file)
                } else if (this.printerState.toLowerCase() !== 'printing') {
                    this.resumeAlert()
                    this.resumePrint()
                }
                break;
            case 'pause':
                if (this.printerState.toLowerCase() !== 'paused') {
                    this.pauseAlert()
                    this.pausePrint()
                }
                break;
            default:
                break;
        }
    }

    startPrint(file: FileData) {
        SocketActions.printerPrintStart(file.pathForMoonraker)
    }

    resumeAlert() {
        const alert: InfoAlertType = {
            message: 'Запрошено возобновление печати',
            type: 'green'
        }
        Alerts.showInfoAlert(alert)
    }

    startPrintAlert() {
        const alert: InfoAlertType = {
            message: `Запрошено начало печати файла: ${this.file.pathForMoonraker}`,
            type: 'green'
        }
        Alerts.showInfoAlert(alert)
    }

    pausePrint() {
        SocketActions.printerPrintPause()
        this.addConsoleEntry('PAUSE')
    }

    pauseAlert() {
        const alert: InfoAlertType = {
            message: `Запрошена пауза`,
            type: 'green'
        }
        Alerts.showInfoAlert(alert)
    }

    resumePrint() {
        SocketActions.printerPrintResume()
        this.addConsoleEntry('RESUME')
    }

    resetFile() {
        this.sendGcode('SDCARD_RESET_FILE')
    }

    throwCancelPrintRequest() {
        if (this.printerPaused || this.printerPrinting) {
            const callback = this.cancelPrint.bind(this)
            const alert: AlertType = {
                header: 'ВНИМАНИЕ!',
                message: 'Принтер печатает/готовится печатать. Отменить печать?',
                type: 'yes_no',
                confirmCallback: callback
            }
            this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
        } else {
            const alert: InfoAlertType = {
                message: 'Принтер не печатает',
                time: 1500,
                type: 'red'
            }
            Alerts.showInfoAlert(alert)
        }

    }

    cancelPrint() {
        this.cancelPrintAlert()
        SocketActions.printerPrintCancel()
        this.addConsoleEntry('CANCEL_PRINT')
    }

    cancelPrintAlert() {
        const alert: InfoAlertType = {
            message: `Запрошена отмена печати`,
            type: 'red'
        }
        Alerts.showInfoAlert(alert)
    }
}
</script>


<style lang="scss">
@import "@/layouts/new_print_layout/css/new_print_window.scss";
</style>