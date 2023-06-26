import { SocketActions } from "@/api/socketActions";
import { InputWindowData } from "@/store/ourExtension/layoutsData/inputWindow/types";
import { RootState } from "@/store/types";
import { Store } from "vuex";
import { ReturnedValcoderData } from "./valcoderProcessor";
import { number } from "echarts";

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

export class UltraFinalOnlineValcoderProcessor {  // Использовать исключительно для окна "Перемещение".
    private readonly MAX_SPEED = 7800; // мм/мин
    private readonly MIN_SPEED = 10;
    private readonly TIME_SHIFT = 200 // горелка поедет либо с tickTimeDiff + TIME_SHIFT, либо с MAX_SPEED, либо с MIN_SPEED. TIME_SHIFT для первого тика
    private readonly TIME_SHIFT_IN_PERCENT = 1
    private readonly TOUCH_TIMEOUT = 500
    private readonly SEND_PIXELS_BORDER = 50
    private $store: Store<RootState>
    private lastSendedValue: number
    private lastStartTouchTime = 0
    private lastUsualTouchTime = 0
    private isItFirstTick = true
    private touchPixels = 0
    private lastTouchCoords = {
        x: 0,
        y: 0
    }
    private valcoderData!: ReturnedValcoderData
    private clockwiseDirection = true


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

    switchOnValcoderWindow() {  // Выполняется при переключении на окно клавиатуры и при кнопке "Назад" с окна валкодера
        this.tryToSendValue()
    }

    switchOnKeyboardWindow() {  // Выполняется при переключении на окно клавиатуры и при кнопке "Назад" с окна валкодера
        this.tryToSendValue()
    }

    keyboardConfirm() {
        this.tryToSendValue()
    }

    setInitCoords(pointX: number, pointY: number) {
        this.lastTouchCoords.x = pointX
        this.lastTouchCoords.y = pointY
    }

    startProcessing(valcoderData: ReturnedValcoderData) {
        this.resetTime()
        this.valcoderData = valcoderData
        const distance = this.getTouchDistance()
        this.resetTouchIfItNeeded()
        this.touchPixels += distance
        this.tryToSendByPixels()
        this.lastTouchCoords.x = valcoderData.touchX
        this.lastTouchCoords.y = valcoderData.touchY
    }

    private resetTouchIfItNeeded() {
        if (this.isItClockwiseDirection()) {
            if (!this.clockwiseDirection) {
                this.touchPixels = 0
                this.clockwiseDirection = true
                this.isItFirstTick = true
            }
        } else {
            if (this.clockwiseDirection) {
                this.touchPixels = 0
                this.clockwiseDirection = false
                this.isItFirstTick = true
            }
        }
    }

    private tryToSendByPixels() {
        if (this.touchPixels > this.SEND_PIXELS_BORDER) {
            const [newValue, steps] = this.resolveNewValue()

            const distance = newValue - +this.processingValue
            const [speed, time] = this.resolveSpeedAndTime(new Date().getTime() - this.lastStartTouchTime, distance)
            this.sendConfigureableMoveGCode(distance + "", speed + "")
            this.lastSendedValue = newValue

            this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue + '')
            this.touchPixels -= steps * this.SEND_PIXELS_BORDER
            this.lastStartTouchTime = new Date().getTime()
        }
    }

    private resolveNewValue(): number[] {
        const steps = Math.trunc(this.touchPixels / this.SEND_PIXELS_BORDER)
        let newValue = steps * this.valcoderStep + Math.abs(+this.processingValue)
        if (this.isItClockwiseDirection()) {
            newValue = steps * this.valcoderStep + +this.processingValue
        } else {
            newValue = +this.processingValue - steps * this.valcoderStep
        }
        return [newValue, steps]
    }


    private getLineCoeffs(x1: number, y1: number, x2: number, y2: number): number[] {
        const k = (y2 + y1) / (x2 - x1)
        const b = y1 - k * x1
        return [k, b]
    }

    private getAbsoluteAngle(x: number, y: number): number {  // Угол относительно оси х против часовой (стандартный геометрический)
        const [k, b] = this.getLineCoeffs(0, 0, x, y)
        const lineAngle = Math.atan(k) * 180 / Math.PI
        const square = this.resolveSquare(x, y)
        switch (square) {
            case 1:
                return lineAngle
            case 2:
                return 90 + 90 - Math.abs(lineAngle)
            case 3:
                return 180 + lineAngle
            case 4:
                return 360 - Math.abs(lineAngle)
        }
    }

    private isItClockwiseDirection() {
        return this.valcoderData.degDiff > 0
    }

    private resolveSquare(xCoord: number, yCoord: number) {
        if (xCoord > 0) {
            if (yCoord > 0) {
                return 1;
            } else {
                return 4;
            }
        } else {
            if (yCoord > 0) {
                return 2;
            } else {
                return 3;
            }
        }
    }

    private getTouchDistance() {
        let distance;
        if (Math.abs(this.valcoderData.degDiff) < 5) {
            distance = this.getUsualDistance(this.lastTouchCoords.x, this.valcoderData.touchX, this.lastTouchCoords.y, this.valcoderData.touchY)
        } else {
            distance = this.getAverageDistance()
        }
        return distance
    }

    private getAverageDistance() {
        const iters = Math.trunc(Math.abs(this.valcoderData.degDiff))
        let lastTouch = {
            x: this.lastTouchCoords.x,
            y: this.lastTouchCoords.y
        }
        const firstRadius = this.getRadius(this.lastTouchCoords.x, this.lastTouchCoords.y)
        const lastRadius = this.getRadius(this.valcoderData.touchX, this.valcoderData.touchY)
        const step = (lastRadius - firstRadius) / iters

        let angle = this.getAbsoluteAngle(this.lastTouchCoords.x, this.lastTouchCoords.y)  // Угол относительно оси х против часовой (стандартный геометрический)
        let calcRadius = firstRadius
        let distance = 0

        for (let i = 1; i < iters; i++) {
            calcRadius += step

            if (this.isItClockwiseDirection()) {
                angle--
                if (angle < 0) {
                    angle = 360 + angle
                }
            } else {
                angle++
                if (angle >= 360) {
                    angle = angle - 360
                }
            }
            const [x, y] = this.getPointByAngleAndRadius(angle, calcRadius)
            distance += this.getUsualDistance(lastTouch.x, x, lastTouch.y, y)
            lastTouch.x = x
            lastTouch.y = y
        }

        const [x, y] = this.getPointByAngleAndRadius(angle, lastRadius)
        distance += this.getUsualDistance(lastTouch.x, x, lastTouch.y, y)

        return distance
    }

    private getPointByAngleAndRadius(angle: number, radius: number) {
        const radAngle = Math.PI * angle / 180
        const x = radius * Math.cos(radAngle)
        const y = radius * Math.sin(radAngle)
        return [x, y]
    }

    private getRadius(x: number, y: number) {
        return this.getUsualDistance(0, x, 0, y)
    }

    private getUsualDistance(x1: number, x2: number, y1: number, y2: number) {
        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
    }

    private resetTime() {
        const currentTime = new Date().getTime()
        if (currentTime - this.lastUsualTouchTime > this.TOUCH_TIMEOUT) {
            this.lastStartTouchTime = currentTime
            this.touchPixels = 0
        }
        this.lastUsualTouchTime = currentTime

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