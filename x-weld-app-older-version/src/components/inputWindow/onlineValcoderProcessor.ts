import { SocketActions } from "@/api/socketActions";
import { InputWindowData } from "@/store/ourExtension/layoutsData/inputWindow/types";
import { RootState } from "@/store/types";
import { Store } from "vuex";

export class OnlineValcoderProcessor {
    readonly SENDING_TIMEOUT = 20;
    $store: Store<RootState>
    currentTimeout: number | null = null
    lastSendedValue: number


    constructor(store: Store<RootState>) {
        this.$store = store
        this.lastSendedValue = +this.processingValue
    }

    get processingValue(): string {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getProcessingValue']
    }

    get inputWindowData(): InputWindowData {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getInputWindowData']
    }

    get confirmCallback(): Function | undefined {
        return this.inputWindowData.callbackAfterConfirm
    }

    startProcessing() {
        this.tryToSendValue()
        this.currentTimeout = setTimeout(() => {
            this.startProcessing()
        }, this.SENDING_TIMEOUT)
    }

    stopProcessing() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout)
            this.currentTimeout = null
        }
        this.tryToSendValue()
    }

    tryToSendValue() {
        const sendedValue = +this.processingValue
        const distance = sendedValue - this.lastSendedValue
        if (distance) {
            this.lastSendedValue = sendedValue
            if (this.confirmCallback) {
                this.confirmCallback(distance)
            }
        }
    }
}

// Копит тики валкодера в течение времени, пока едет горелка, отсылает их за TIME_SHIFT до конца поездки горелки. Приводит их либо к MIN_TIME поездки, либо к MAX_SPEED
export class FixedOnlineValcoderProcessor {  // Использовать исключительно для окна "Перемещение".
    readonly CHECKING_TIMEOUT = 20;
    readonly MAX_SPEED = 7800; // мм/мин
    readonly MIN_TIME = 1000; // мс
    readonly TIME_SHIFT = 100; // мс, разница во времени между окончанием приезда горелки и отправлением нового значения
    $store: Store<RootState>
    currentTimeout: number | null = null
    lastSendedValue: number
    valueAccumulator: number = 0  // мм, на сколько надо съехать
    sendingTimeout: number | null = null


    constructor(store: Store<RootState>) {
        this.$store = store
        this.lastSendedValue = +this.processingValue
    }

    get processingValue(): string {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getProcessingValue']
    }

    get inputWindowData(): InputWindowData {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getInputWindowData']
    }

    private tryToSendValue() {
        const currentValue = +this.processingValue
        const distance = currentValue - this.lastSendedValue
        if (distance) {
            this.lastSendedValue = currentValue
            this.sendMoveGcode(distance + "")
        }
    }

    private smoothTryToSendValue() {
        const currentValue = +this.processingValue
        const distance = currentValue - this.lastSendedValue
        this.valueAccumulator += distance - this.valueAccumulator
        if (!this.sendingTimeout && this.valueAccumulator) {
            const [speed, reqiredTime] = this.resolveSpeedAndRequiredTime()
            this.sendConfigureableMoveGCode(this.valueAccumulator + '', speed + '')
            this.lastSendedValue = currentValue
            this.sendingTimeout = setTimeout(() => {
                console.log(`Горелка прошла`)
            }, reqiredTime)
            setTimeout(() => {
                this.sendingTimeout = null
            }, reqiredTime - this.TIME_SHIFT)
            this.valueAccumulator = 0
        }
    }

    private resolveSpeedAndRequiredTime() {
        let reqiredTime = this.MIN_TIME
        let speed = +((this.valueAccumulator / reqiredTime) * 60 * 1000).toFixed(0);
        if (speed > this.MAX_SPEED) {
            speed = this.MAX_SPEED
            reqiredTime = +((200 / this.MAX_SPEED) * 60 * 1000).toFixed(0)
        }
        return [speed, reqiredTime]
    }


    switchOnValcoderWindow() {
        const currentValue = +this.processingValue
        this.valueAccumulator = currentValue - this.lastSendedValue
        this.valcoderProcessing()
    }

    valcoderProcessing() {
        this.smoothTryToSendValue()
        this.currentTimeout = setTimeout(() => {
            this.valcoderProcessing()
        }, this.CHECKING_TIMEOUT)
    }

    switchOnKeyboardWindow() {  // Выполняется при переключении на окно клавиатуры и при кнопке "Назад" с окна валкодера
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout)
        }
        this.tryToSendValue()
    }

    keyboardConfirm() {
        this.tryToSendValue()
    }

    private sendMoveGcode(distance: string, negative = false) {  // G91 - относительные координаты (0 в точке, где сейчас горелка), G90 - абс. коорд. (0 в 0 станка)
        const axis = this.inputWindowData.coordName.toLowerCase()
        const rate = (axis.toLowerCase() === 'z')
            ? this.$store.state.config.uiSettings.general.defaultToolheadZSpeed
            : this.$store.state.config.uiSettings.general.defaultToolheadXYSpeed

        this.sendGcode(`G91
            G1 ${axis}${distance} F${rate * 60}
            G90`)
    }

    private sendConfigureableMoveGCode(distance: string, speed: string) {
        const axis = this.inputWindowData.coordName.toLowerCase()
        this.sendGcode(`G91
            G1 ${axis}${distance} F${speed}
            G90`)
    }

    private sendGcode(gcode: string, wait?: string) {
        SocketActions.printerGcodeScript(gcode, wait)
        this.addConsoleEntry(gcode)
    }

    private addConsoleEntry(message: string) {
        this.$store.dispatch('console/onAddConsoleEntry', { message, type: 'command' })
    }
}

export class FinalOnlineValcoderProcessor {  // Использовать исключительно для окна "Перемещение".
    readonly MAX_SPEED = 7800; // мм/мин
    readonly MIN_SPEED = 10;
    readonly TIME_SHIFT = 200 // горелка поедет либо с tickTimeDiff + TIME_SHIFT, либо с MAX_SPEED, либо с MIN_SPEED. TIME_SHIFT для первого тика
    readonly TIME_SHIFT_IN_PERCENT = 1
    readonly TOUCH_TIMEOUT = 1000
    $store: Store<RootState>
    lastSendedValue: number
    lastValcoderTickTime = 0
    lastUsualTouchTime = 0
    isItFirstTick = true


    constructor(store: Store<RootState>) {
        this.$store = store
        this.lastSendedValue = +this.processingValue
    }

    get processingValue(): string {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getProcessingValue']
    }

    get inputWindowData(): InputWindowData {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getInputWindowData']
    }

    get valcoderStep(): number {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getValcoderStep']
    }

    rotateHandler() {
        const currentTime = new Date().getTime()
        if (currentTime - this.lastUsualTouchTime > this.TOUCH_TIMEOUT) {
            this.lastValcoderTickTime = currentTime
            this.isItFirstTick = true
        }
        this.lastUsualTouchTime = currentTime
    }

    tickHandler(newValue: string) {
        const currentTime = new Date().getTime()
        const tickTimeDiff = currentTime - this.lastValcoderTickTime
        this.lastValcoderTickTime = currentTime
        const distance = +newValue - +this.lastSendedValue
        const [speed, requiredTime] = this.resolveSpeedAndTime(tickTimeDiff, distance)
        this.sendConfigureableMoveGCode(distance + '', speed + '')
        this.lastSendedValue = +newValue
    }


    private resolveSpeedAndTime(tickTimeDiff: number, distance: number) {
        distance = Math.abs(distance)
        let requiredTime = tickTimeDiff
        if (this.isItFirstTick) {
            requiredTime = tickTimeDiff + this.TIME_SHIFT
            // requiredTime = tickTimeDiff * (this.TIME_SHIFT_IN_PERCENT / 100)
            this.isItFirstTick = false
        }
        let speed = +((distance / requiredTime) * 60 * 1000).toFixed(0);
        if (speed > this.MAX_SPEED) {
            speed = this.MAX_SPEED
            requiredTime = +((distance / this.MAX_SPEED) * 60 * 1000).toFixed(0)
        } else if (speed < this.MIN_SPEED) {
            speed = this.MIN_SPEED
            requiredTime = +((distance / this.MAX_SPEED) * 60 * 1000).toFixed(0)
        }
        return [speed, requiredTime]
    }

    private tryToSendValue() {
        const currentValue = +this.processingValue
        const distance = currentValue - this.lastSendedValue
        if (distance) {
            this.lastSendedValue = currentValue
            this.sendMoveGcode(distance + "")
        }
    }

    switchOnValcoderWindow() {  // Выполняется при переключении на окно клавиатуры и при кнопке "Назад" с окна валкодера
        this.tryToSendValue()
    }

    switchOnKeyboardWindow() {  // Выполняется при переключении на окно клавиатуры и при кнопке "Назад" с окна валкодера
        this.tryToSendValue()
    }

    keyboardConfirm() {
        this.tryToSendValue()
    }

    private sendMoveGcode(distance: string, negative = false) {  // G91 - относительные координаты (0 в точке, где сейчас горелка), G90 - абс. коорд. (0 в 0 станка)
        const axis = this.inputWindowData.coordName.toLowerCase()
        const rate = (axis.toLowerCase() === 'z')
            ? this.$store.state.config.uiSettings.general.defaultToolheadZSpeed
            : this.$store.state.config.uiSettings.general.defaultToolheadXYSpeed

        this.sendGcode(`G91
            G1 ${axis}${distance} F${rate * 60}
            G90`)
    }

    private sendConfigureableMoveGCode(distance: string, speed: string) {
        const axis = this.inputWindowData.coordName.toLowerCase()
        this.sendGcode(`G91
            G1 ${axis}${distance} F${speed}
            G90`)
    }

    private sendGcode(gcode: string, wait?: string) {
        SocketActions.printerGcodeScript(gcode, wait)
        this.addConsoleEntry(gcode)
    }

    private addConsoleEntry(message: string) {
        this.$store.dispatch('console/onAddConsoleEntry', { message, type: 'command' })
    }
}