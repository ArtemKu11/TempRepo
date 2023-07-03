<template>
    <div class="print-window">
        <div v-if="!pause" class="green-indicator">
        </div>

        <div v-if="pause" class="red-indicator">
        </div>

        <div class="header">
            <div class="time-and-operation">
                <div @click="$router.go(-1)" class="time-holder">{{ actualTime }}</div>
                <div class="operation-container">{{ localPrinterState }}...</div>
            </div>
            <div class="warnings-container">
                <span v-if="warningFlag">WARNING</span>
                <span v-if="noGasFlag">NO GAS</span>
                <!-- <span>WARNING</span>
                <span>NO GAS</span>
                <span>COLLISION</span> -->
            </div>
        </div>

        <div class="center">
            <div class="rejim">
                <span>Параметры режима: </span>
                <span>{{ printingDiapason.profile.name }}</span>
            </div>
            <div class="print-params-buttons">
                <div class="colorful-buttons">
                    <button class="parameter-button with-icon">
                        <div class="icon-wrapper">
                            <div class="a-icon">a</div>
                        </div>
                        <div class="button-info">
                            <span>{{ current }}</span>
                            <div class="underline"></div>
                            <span>Ток, А</span>
                        </div>

                    </button>
                    <button class="parameter-button with-icon">
                        <div class="icon-wrapper">
                            <div class="b-icon">b</div>
                        </div>
                        <div class="button-info">
                            <span>{{ voltage }}</span>
                            <div class="underline"></div>
                            <span>Напряжение, В</span>
                        </div>
                    </button>
                    <button class="parameter-button">
                        <span>{{ feedRate }}</span>
                        <div class="underline"></div>
                        <span>V подачи, м/мин</span>
                    </button>
                </div>

                <span class="print-params-span">Параметры печати:</span>

                <div class="usual-buttons">
                    <button class="parameter-button">
                        <div class="img-wrapper">
                            <img src="@/style/printWindow/img/oscillation.svg" width="105" height="1">
                        </div>
                        <span>Тип: {{ oscillationType }}</span>
                    </button>
                    <button class="parameter-button">
                        <span>{{ weldingSpeed }}</span>
                        <span>V печати, м/мин</span>
                    </button>
                    <button class="parameter-button">
                        <span>{{ shift }}</span>
                        <span>Сдвиг Z, мм</span>
                    </button>
                </div>
            </div>
            <div class="control-prints">
                <div class="control-print current">
                    <div class="a-icon">a</div>
                    <span>Ток источника</span>
                </div>
                <div class="control-print voltage">
                    <div class="b-icon">b</div>
                    <span>Напряжение источника</span>
                </div>
                <div class="control-print img layers">
                    <span>Слои: {{ printLayer }}/{{ file.layers }}</span>
                    <img src="@/style/printWindow/img/layers.svg" alt="">
                </div>
                <div class="control-print img heigth">
                    <span>Высота, мм: 846</span>
                    <img src="@/style/printWindow/img/heigth.svg" alt="">
                </div>
            </div>
        </div>

        <div class="control-buttons">

            <CircleBar v-if="isPrinting" />

            <button v-if="!isPrinting" :class="{ 'active': buttonsState.firstButton }"
                @touchstart="touchStartHandler($event, 'firstButton')" @touchend="touchEndHandler('firstButton')"
                class="control-button move">
                <div class="img-wrapper">
                    <img src="@/style/printWindow/img/move.svg" alt="">
                </div>
                <span>Перемещение</span>
            </button>

            <button v-if="!isPrinting" :class="{ 'active': buttonsState.secondButton }"
                @touchstart="touchStartHandler($event, 'secondButton')" @touchend="touchEndHandler('secondButton')"
                class="control-button layer-settings">
                <div class="img-wrapper">
                    <img src="@/style/printWindow/img/layer_settings.svg" alt="">
                </div>
                <span>Параметры слоя</span>
            </button>

            <button v-if="!isPrinting" :class="{ 'active': buttonsState.thirdButton }"
                @touchstart="touchStartHandler($event, 'thirdButton')" @touchend="touchEndHandler('thirdButton')"
                class="control-button settings">
                <div class="img-wrapper">
                    <img src="@/style/printWindow/img/settings.svg" alt="">
                </div>
                <span>Настройки</span>
            </button>

            <button :class="{ 'active': buttonsState.fourthButton }" @touchstart="touchStartHandler($event, 'fourthButton')"
                @touchend="touchEndHandler('fourthButton')" class="control-button revert shift-plus">
                <span>Сдвиг +</span>
                <div class="img-wrapper">
                    <img src="@/style/printWindow/img/shift_plus.svg" alt="">
                </div>
            </button>

            <button :class="{ 'active': buttonsState.fifthButton }" @touchstart="touchStartHandler($event, 'fifthButton')"
                @touchend="touchEndHandler('fifthButton')" class="control-button revert shift-minus">
                <span>Сдвиг -</span>
                <div class="img-wrapper">
                    <img src="@/style/printWindow/img/shift_minus.svg" alt="">
                </div>
            </button>

            <button :class="{ 'active': buttonsState.sixthButton }" @touchstart="touchStartHandler($event, 'sixthButton')"
                @touchend="touchEndHandler('sixthButton')" class="control-button revert arc">
                <span>Дуга неизвестна</span>
                <div class="img-wrapper">
                    <img src="@/style/printWindow/img/arc.svg" alt="">
                </div>
            </button>
        </div>

        <div v-if="!isPrinting" class="footer">
            <div class="file-info">
                <div class="filename">
                    <img src="@/style/printWindow/img/file_icon.svg" alt="">
                    <span>{{ fileName }}</span>
                </div>
                <div class="progress">
                    <img src="@/style/printWindow/img/progress.svg" alt="">
                    <span>Прогресс: {{ printProgress }}%</span>
                </div>
            </div>

            <div class="progress-bar-wrapper">
                <img src="@/style/printWindow/img/progress_bar.svg" alt="">
                <ProgressBar />
            </div>
        </div>

        <div v-if="isPrinting" class="only-filename">
            <img src="@/style/printWindow/img/big_file_icon.svg" alt="">
            <span>{{ fileName }}</span>
        </div>

    </div>
</template>


<script lang="ts">
import { SocketActions } from '@/api/socketActions';
import StateMixin from '@/mixins/state';
import WindowsMixin from '@/mixins/windows';
import { FileData } from '@/store/ourExtension/files/types';
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers';
import { InfoAlertType, AlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { PrintingDiapasonForMoonraker, ProfilesMetadata } from '@/store/ourExtension/profiles/types';
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
import ProgressBar from './ProgressBar.vue';
import CircleBar from './CircleBar.vue';
import GpioMixin from '@/mixins/gpio';

@Component({
    components: {
        ProgressBar, CircleBar
    },
})
export default class PrintWindow extends Mixins(WindowsMixin, StateMixin, GpioMixin) {
    warningFlag = false
    noGasFlag = false
    processingSetter: string = ''

    buttonsState = {  // флаги для бинда .active класса для мнгновенной подмены картинок по touchstart
        firstButton: false,  // Перемещение
        secondButton: false,  // Параметры слоя
        thirdButton: false, // Настройки
        fourthButton: false,  // Сдвиг +
        fifthButton: false,  // Сдвиг -
        sixthButton: false  // Дуга
    }

    mounted() {
        setTimeout(() => { this.setPrintProgress() }, 100)
    }

    beforeDestroy() {
        this.setAllButtonsPressed(false)
    }

    setPrintProgress() {
        const progress = this.printProgress
        const circleBar = this.$refs.circleBar as SVGElement
        const progressBar = this.$refs.progressBar as HTMLElement
        if (circleBar) {
            this.setPercent(progress, circleBar)
        }
        if (progressBar) {
            this.setProgressBarPercent(progress, progressBar)
        }
    }

    setProgressBarPercent(percent: number, progressBar: HTMLElement) {
        progressBar.style.width = `${percent}%`
    }

    setPercent(percent: number, circleBar: SVGElement) {
        const circleLength = 2 * Math.PI * 130
        const progressPercent = circleLength * percent / 100
        const probelPercent = circleLength - progressPercent
        circleBar.style.strokeDasharray = `${progressPercent} ${probelPercent}`
    }

    touchStartHandler(e: TouchEvent, button: string) {
        if (button in this.buttonsState) {
            this.setAllButtonsPressed(false)
            const state = this.buttonsState as any
            state[button] = true
            if (e.cancelable) {
                e.preventDefault()
                e.stopPropagation()
            }
            this.resolveButtonClick(button)
        }
    }

    resolveButtonClick(button: string) {
        switch (button) {
            case "fourthButton":  // Сдвиг +
                this.shiftPlus()
                return;
            case "fifthButton":  // Сдвиг -
                this.shiftMinus()
                return;
            default:
                return;
        }
    }

    shiftPlus() {
        this.shift = +(this.shift + 0.1).toFixed(1)
    }

    shiftMinus() {
        this.shift = +(this.shift - 0.1).toFixed(1)
    }

    touchEndHandler(button: string) {
        if (button in this.buttonsState) {
            const state = this.buttonsState as any
            state[button] = false
        }
    }

    get actualTime(): string {
        return this.$store.getters['ourExtension/layoutsData/baseLayout/getActualTime']();
    }

    get isPrinting(): boolean {
        return this.printerState.toLowerCase() === 'printing'
    }

    get pause(): boolean {
        return this.printerState.toLowerCase() === 'paused'
    }


    get printProgress(): number {  // В процентах
        let progress = this.$store.getters['printer/getPrintProgress']
        progress = +(progress * 100).toFixed(0)
        const circleBar = this.$refs.circleBar as SVGElement
        if (circleBar) {
            this.setPercent(progress, circleBar)
        }
        const progressBar = this.$refs.progressBar as HTMLElement
        if (progressBar) {
            this.setProgressBarPercent(progress, progressBar)
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

    /// GPIO SUPPORT:

    gpioButtonDownEventHandler(button: string) {
        if (button in this.buttonsState) {
            const state = this.buttonsState as any
            state[button] = true
        }
    }

    gpioButtonUpEventHandler(button: string, needToResolveClick = true) {
        if (button in this.buttonsState) {
            const state = this.buttonsState as any
            state[button] = false
            if (needToResolveClick) {
                this.resolveButtonClick(button)
            }
        }
    }

    @Watch('isFirstButtonPressed')
    firstButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isFirstButtonPressed
        if (isPressed) {
            this.gpioButtonDownEventHandler('firstButton')
        } else {
            if (!this.buttonsInterrups.firstButton) {
                this.gpioButtonUpEventHandler('firstButton')
            } else {
                this.gpioButtonUpEventHandler('firstButton', false)
            }
        }
    }

    @Watch('isSecondButtonPressed')
    secondButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isSecondButtonPressed
        if (isPressed) {
            this.gpioButtonDownEventHandler('secondButton')
        } else {
            if (isPressed) {
                this.gpioButtonUpEventHandler('secondButton')
            } else {
                if (!this.buttonsInterrups.secondButton) {
                    this.gpioButtonUpEventHandler('secondButton')
                } else {
                    this.gpioButtonUpEventHandler('secondButton', false)
                }
            }
        }
    }

    @Watch('isThirdButtonPressed')
    thirdButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isThirdButtonPressed
        if (isPressed) {
            this.gpioButtonDownEventHandler('thirdButton')
        } else {
            if (!this.buttonsInterrups.thirdButton) {
                this.gpioButtonUpEventHandler('thirdButton')
            } else {
                this.gpioButtonUpEventHandler('thirdButton', false)
            }
        }
    }

    @Watch('isFourthButtonPressed')
    fourthButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isFourthButtonPressed
        if (isPressed) {
            this.gpioButtonDownEventHandler('fourthButton')
        } else {
            if (!this.buttonsInterrups.fourthButton) {
                this.gpioButtonUpEventHandler('fourthButton')
            } else {
                this.gpioButtonUpEventHandler('fourthButton', false)
            }
        }
    }

    @Watch('isFifthButtonPressed')
    fifthButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isFifthButtonPressed
        if (isPressed) {
            this.gpioButtonDownEventHandler('fifthButton')
        } else {
            if (!this.buttonsInterrups.fifthButton) {
                this.gpioButtonUpEventHandler('fifthButton')
            } else {
                this.gpioButtonUpEventHandler('fifthButton', false)
            }
        }
    }

    @Watch('isSixthButtonPressed')
    sixthButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isSixthButtonPressed
        if (isPressed) {
            this.gpioButtonDownEventHandler('sixthButton')
        } else {
            if (!this.buttonsInterrups.sixthButton) {
                this.gpioButtonUpEventHandler('sixthButton')
            } else {
                this.gpioButtonUpEventHandler('sixthButton', false)
            }
        }
    }

}
</script>


<style lang="scss">
@import '@/style/printWindow/css/printWindow.scss';
</style>