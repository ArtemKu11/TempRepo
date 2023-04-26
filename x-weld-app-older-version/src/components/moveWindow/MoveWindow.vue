<template>
    <div class="content-container move-layout">
        <div id="content-header">
            <div id="name-container">Профиль печати для всех слоев (124-275)</div>
            <div id="coordinates-container">
                <img src="@/layouts/move_layout/img/gorelka_logo.svg" />
                <span id="x-coords">{{ coordinatesHolder[0] }}</span>
                <span id="y-coords">{{ coordinatesHolder[1] }}</span>
                <span id="z-coords">{{ coordinatesHolder[2] }}</span>
            </div>
        </div>
        <div id="content-center">
            <div id="buttons-container">
                <div id="two-control-buttons">
                    <button><img src="@/layouts/move_layout/img/axis_refresh.png" height="50" /><span>Сброс
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
                    <span>{{ coordinatesHolder[0] }}</span>
                    <span>мм</span>
                </div>
                <div class="coord-label-div y">
                    <button @click="openInputWindow('Y')"><img
                            src="@/layouts/move_layout/img/keyboard_button.svg" /></button>
                    <span>{{ coordinatesHolder[1] }}</span>
                    <span>мм</span>
                </div>
                <div class="coord-label-div z">
                    <button @click="openInputWindow('Z')"><img
                            src="@/layouts/move_layout/img/keyboard_button.svg" /></button>
                    <span>{{ coordinatesHolder[2] }}</span>
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

@Component({
    components: {
        StepSelector, XBigButton, YBigButton, ZBigButton
    },
})
export default class MoveWindow extends Mixins(StateMixin) {
    get coordinatesHolder(): number[] {
        return this.$store.getters['ourExtension/layoutsData/moveWindow/getCoordinates']()
    }

    get currentStep(): number {
        return this.$store.getters['ourExtension/layoutsData/moveWindow/getCurrentStep'];
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

        const inputWindowData: InputWindowData = {
            coordName: coordName,
            initValue: this.resolveInitInputWindowValue(coordName),
            // dispachAfterConfirm: `ourExtension/layoutsData/moveWindow/set${coordName.toUpperCase()}`,
            // dispachAfterConfirm: `ourExtension/layoutsData/moveWindow/setNeedToSendGcodeMove`,
            dispachAfterConfirm: `void`,
            callbackAfterConfirm: confirmCallback,
            maxValue: 2000,
            minValue: -45
        }
        const valcoderStep = this.$store.getters['ourExtension/layoutsData/moveWindow/getCurrentStep']
        const initInfo: InitInputWindowData = {
            inputWindowData: inputWindowData,
            valcoderStep: valcoderStep,
        }
        this.$store.dispatch('ourExtension/layoutsData/inputWindow/initInputWindow', initInfo);
        this.$store.dispatch('ourExtension/windowFlags/openInputWindow');
    }

    newValueReceiver(newValue: number) {
        const inputWindowData = this.$store.getters['ourExtension/layoutsData/inputWindow/getInputWindowData'] as InputWindowData
        const axis = inputWindowData.coordName.toLowerCase();
        const oldValue = this.resolveInitInputWindowValue(axis);
        const distance = newValue - oldValue;
        if (distance) {
            this.sendMoveGcode(axis, distance + '');
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
        this.sendMoveGcode(lowerCaseAxis, distance)
    }

    minusClickHandler(axis: string) {
        const lowerCaseAxis = axis.toLowerCase()
        const distance = '-' + this.currentStep
        this.sendMoveGcode(lowerCaseAxis, distance)
    }

    sendMoveGcode(axis: string, distance: string, negative = false) {
        axis = axis.toLowerCase()
        const rate = (axis.toLowerCase() === 'z')
            ? this.$store.state.config.uiSettings.general.defaultToolheadZSpeed
            : this.$store.state.config.uiSettings.general.defaultToolheadXYSpeed
        // const inverted = this.$store.state.config.uiSettings.general.axis[axis].inverted || false
        // distance = ((negative && !inverted) || (!negative && inverted))
        //     ? '-' + distance
        //     : distance

        if ("this.forceMove") {
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