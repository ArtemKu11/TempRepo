<template>
    <div class="content-container move-layout">
        <div id="content-header">
            <div id="name-container">Перемещение горелки</div>
            <div id="coordinates-container">
                <img src="@/layouts/move_layout/img/gorelka_logo.svg" />
                <span id="x-coords">{{ fixedCoordinatesHolder[0] }}</span>
                <span id="y-coords">{{ fixedCoordinatesHolder[1] }}</span>
                <span id="z-coords">{{ fixedCoordinatesHolder[2] }}</span>
            </div>
        </div>
        <div id="content-center">
            <div id="buttons-container">
                <div id="two-control-buttons">
                    <button @click="resetAxises"><img src="@/layouts/move_layout/img/axis_refresh.png"
                            height="50" /><span>Сброс
                            осей</span></button>
                    <button @click="sendGcode('G28', $waits.onHomeAll)"><img src="@/layouts/move_layout/img/park.png"
                            height="50" /><span>Парковка</span></button>
                </div>
                <XBigButton @plusClick="plusClickHandler" @minusClick="minusClickHandler" />
                <YBigButton @plusClick="plusClickHandler" @minusClick="minusClickHandler" />
                <ZBigButton @plusClick="plusClickHandler" @minusClick="minusClickHandler" />

            </div>
            <div id="lables-container">
                <div class="coord-label-div x">
                    <button @click="openInputWindow('X')"><img
                            src="@/layouts/move_layout/img/keyboard_button.svg" /></button>
                    <span>{{ fixedCoordinatesHolder[0] }}</span>
                    <span>мм</span>
                </div>
                <div class="coord-label-div y">
                    <button @click="openInputWindow('Y')"><img
                            src="@/layouts/move_layout/img/keyboard_button.svg" /></button>
                    <span>{{ fixedCoordinatesHolder[1] }}</span>
                    <span>мм</span>
                </div>
                <div class="coord-label-div z">
                    <button @click="openInputWindow('Z')" @touchstart="unlockHandler" @touchend="unlockRejector"><img
                            src="@/layouts/move_layout/img/keyboard_button.svg" /></button>
                    <span>{{ fixedCoordinatesHolder[2] }}</span>
                    <span>мм</span>
                </div>
            </div>
            <StepSelector />
        </div>
    </div>
</template>


<script lang="ts">
import StateMixin from '@/mixins/state';
import { InitInputWindowData, InputWindowData } from '@/store/ourExtension/layoutsData/inputWindow/types';
import { Mixins, Component, Vue, Watch } from 'vue-property-decorator';
import StepSelector from './StepSelector.vue';
import XBigButton from './XBigButton.vue';
import YBigButton from './YBigButton.vue';
import ZBigButton from './ZBigButton.vue'
import { InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers';

@Component({
    components: {
        StepSelector, XBigButton, YBigButton, ZBigButton
    },
})
export default class MoveWindow extends Mixins(StateMixin) {
    unlockTimeout = 0

    get maxCoordinates(): number[] {
        let maxCoords = this.$store.getters['ourExtension/layoutsData/moveWindow/getMaxCoordinates']()
        if (!maxCoords || !maxCoords.length) {
            maxCoords = [1000, 1000, 1000]
        }
        return maxCoords
    }

    get minCoordinates(): number[] {
        let minCoords = this.$store.getters['ourExtension/layoutsData/moveWindow/getMinCoordinates']()
        if (!minCoords || !minCoords.length) {
            minCoords = [-1000, -1000, -1000]
        }
        return minCoords
    }

    get currentStep(): number {
        return this.$store.getters['ourExtension/layoutsData/moveWindow/getCurrentStep'];
    }

    resetAxises() {
        // this.unlockZBrake()
        // this.sendGcode('set_kinematic_position x=0 y=0 z=0')
        this.sendGcode('G92 x0 y0 z0')
        const alert: InfoAlertType = {
            message: 'Запрошен сброс осей',
            time: 2000,
            type: "green"
        }
        Alerts.showInfoAlert(alert)
    }

    unlockHandler() {
        this.unlockTimeout = setTimeout(() => {
            this.unlockZBrake()
        }, 1000)
    }

    unlockRejector() {
        if (this.unlockTimeout) {
            clearTimeout(this.unlockTimeout)
        }
    }

    unlockZBrake() {
        this.sendGcode('set_kinematic_position x=0 y=0 z=0')
        const currentZ = this.coordinatesHolder[2]
        const maxZ = this.maxCoordinates[2]
        const minZ = this.minCoordinates[2]
        if (maxZ - currentZ >= 0.1) {
            this.sendMoveGcode('z', '0.1')
            this.sendMoveGcode('z', '-0.1')
            this.successUnlockAlert()
        } else if (currentZ - minZ >= 0.1) {
            this.sendMoveGcode('z', '-0.1')
            this.sendMoveGcode('z', '0.1')
            this.successUnlockAlert()
        } else {
            const alert: InfoAlertType = {
                message: "Не удалось разблокировать тормоза z-оси. Проблемы максимума/минимума",
                time: 2000,
                type: 'red'
            }
            Alerts.showInfoAlert(alert)
        }
    }

    successUnlockAlert() {
        const alert: InfoAlertType = {
            message: "Тормоза разблокированы!",
            time: 2000,
            type: 'green'
        }
        Alerts.showInfoAlert(alert)
    }

    // get moveAfterInputWindow() {
    //     return this.$store.getters['ourExtension/layoutsData/moveWindow/getNeedToSendGCodeMove'];
    // }

    // @Watch("moveAfterInputWindow")
    // inputWindowConfirmWatcher() {
    //     if (this.moveAfterInputWindow) {
    //         this.$store.commit(`ourExtension/layoutsData/moveWindow/setNeedToSendGcodeMove`, false)
    //         const newValue = this.$store.getters['ourExtension/layoutsData/inputWindow/getFinalValue'] as number
    //         const inputWindowData = this.$store.getters['ourExtension/layoutsData/inputWindow/getInputWindowData'] as InputWindowData
    //         const axis = inputWindowData.coordName.toLowerCase();
    //         const oldValue = this.resolveInitInputWindowValue(axis);
    //         const distance = newValue - oldValue + "";
    //         this.sendMoveGcode(axis, distance);
    //     }
    // }

    openInputWindow(coordName: string) {
        const confirmCallback = this.newValueReceiver.bind(this)

        const [minValue, maxValue] = this.resolveMinMaxValue(coordName)

        const inputWindowData: InputWindowData = {
            coordName: coordName,
            initValue: this.resolveInitInputWindowValue(coordName),
            // dispachAfterConfirm: `ourExtension/layoutsData/moveWindow/set${coordName.toUpperCase()}`,
            // dispachAfterConfirm: `ourExtension/layoutsData/moveWindow/setNeedToSendGcodeMove`,
            dispachAfterConfirm: `void`,
            callbackAfterConfirm: confirmCallback,
            maxValue: maxValue,
            minValue: minValue,
            isItOnlineValcoder: true
        }
        const valcoderStep = this.$store.getters['ourExtension/layoutsData/moveWindow/getCurrentStep']
        const initInfo: InitInputWindowData = {
            inputWindowData: inputWindowData,
            valcoderStep: valcoderStep,
        }
        this.$store.dispatch('ourExtension/layoutsData/inputWindow/initInputWindow', initInfo);
        this.$store.dispatch('ourExtension/windowFlags/openInputWindow');
    }

    newValueReceiver(newValue: number) {  // то, насколько надо съехать (предполагает Online Valcoder)
        const inputWindowData = this.$store.getters['ourExtension/layoutsData/inputWindow/getInputWindowData'] as InputWindowData
        const axis = inputWindowData.coordName.toLowerCase();
        if (newValue) {
            this.sendMoveGcode(axis, newValue + '');
        }
    }

    // newValueReceiver(newValue: number) {  // старая имплемантация
    // const inputWindowData = this.$store.getters['ourExtension/layoutsData/inputWindow/getInputWindowData'] as InputWindowData
    //     const axis = inputWindowData.coordName.toLowerCase();
    //     const oldValue = this.resolveInitInputWindowValue(axis);
    //     const distance = newValue - oldValue;
    //     if (distance) {
    //         this.sendMoveGcode(axis, distance + '');
    //     }
    // }

    resolveMinMaxValue(coordName: string): number[] { // min, max
        switch (coordName.toUpperCase()) {
            case 'X':
                return [this.minCoordinates[0], this.maxCoordinates[0]]
            case 'Y':
                return [this.minCoordinates[1], this.maxCoordinates[1]]
            case 'Z':
                return [this.minCoordinates[2], this.maxCoordinates[2]]
            default:
                return [0, 1000];
        }
    }

    resolveInitInputWindowValue(coordName: string): number {
        switch (coordName.toUpperCase()) {
            case 'X':
                return this.coordinatesHolder[0];
            case 'Y':
                return this.coordinatesHolder[1];
            case 'Z':
                return this.coordinatesHolder[2];
            default:
                return 0;
        }
    }

    plusClickHandler(axis: string) {
        const lowerCaseAxis = axis.toLowerCase()
        const distance = this.currentStep + ""
        if (this.borderCheck(axis, distance)) {
            this.sendMoveGcode(lowerCaseAxis, distance)
        } else {
            const alert: InfoAlertType = {
                message: 'Достигнуто максимальное значение'
            }
            Alerts.showInfoAlert(alert)
        }
    }

    borderCheck(axis: string, distance: string) {
        const lowerCaseAxis = axis.toLowerCase()
        let newCoord;
        switch (lowerCaseAxis) {
            case 'x':
                newCoord = this.coordinatesHolder[0] + +distance
                return newCoord > this.minCoordinates[0] && newCoord < this.maxCoordinates[0]
            case 'y':
                newCoord = this.coordinatesHolder[1] + +distance
                return newCoord > this.minCoordinates[1] && newCoord < this.maxCoordinates[1]
            case 'z':
                newCoord = this.coordinatesHolder[2] + +distance
                return newCoord > this.minCoordinates[2] && newCoord < this.maxCoordinates[2]
            default:
                return false
        }
    }

    minusClickHandler(axis: string) {
        const lowerCaseAxis = axis.toLowerCase()
        const distance = '-' + this.currentStep
        if (this.borderCheck(axis, distance)) {
            this.sendMoveGcode(lowerCaseAxis, distance)
        } else {
            const alert: InfoAlertType = {
                message: 'Достигнуто минимальное значение'
            }
            Alerts.showInfoAlert(alert)
        }
    }

    sendMoveGcode(axis: string, distance: string, negative = false) {  // G91 - относительные координаты (0 в точке, где сейчас горелка), G90 - абс. коорд. (0 в 0 станка)
        axis = axis.toLowerCase()
        const rate = (axis.toLowerCase() === 'z')
            ? this.$store.state.config.uiSettings.general.defaultToolheadZSpeed
            : this.$store.state.config.uiSettings.general.defaultToolheadXYSpeed
        // const inverted = this.$store.state.config.uiSettings.general.axis[axis].inverted || false
        // distance = ((negative && !inverted) || (!negative && inverted))
        //     ? '-' + distance
        //     : distance

        // if ("this.forceMove") {
        if (false) {  // ))0)0
            const accel = (axis.toLowerCase() === 'z')
                ? this.$store.getters['printer/getPrinterSettings']('printer.max_z_accel')
                : this.$store.state.printer.printer.toolhead.max_accel
            this.sendGcode(`FORCE_MOVE STEPPER=stepper_${axis} DISTANCE=${distance} VELOCITY=${rate} ACCEL=${accel}`)
        } else {
            this.sendGcode(`G91
      G1 ${axis}${distance} F${rate * 60}
      G90`)
        }
    }
}
</script>


<style lang="scss">
@import "@/layouts/move_layout/css/move_layout.scss";
</style>