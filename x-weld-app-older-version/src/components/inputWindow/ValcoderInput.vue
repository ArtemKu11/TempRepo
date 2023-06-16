<template>
    <div id="valcoder-input-resources">
        <div id="valcoder">
            <img src="@/layouts/move_layout/img/valcoder_strelka.png" />
            <div id="plus-minus-holder">
                <span>-</span>
                <span>+</span>
            </div>
            <div ref="valcoderCircleHolder" id="valcoder-circle-holder">
                <div @touchstart="touchHandler" @touchmove.prevent="touchHandler"
                    @touchend="touchHandler" id="valcoder-circle">
                    <div ref="valcoder" id="valcoder-invisible-circle">
                        <div ref="valcoderPoint" id="valcoder-point"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="confirm-buttons">
            <button @click="cancelButtonClick"><img
                    src="@/layouts/move_layout/img/cancel_button.png"><span>Отменить</span></button>
            <button @click="confirmButtonClick"><img
                    src="@/layouts/move_layout/img/save_button.png"><span>Сохранить</span></button>
        </div>
    </div>
</template>


<script lang="ts">
import { InputWindowData } from '@/store/ourExtension/layoutsData/inputWindow/types';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { TimeProcessor } from './timeProcessor';
import { ValcoderProcessor } from './valcoderProcessor';
import { FinalOnlineValcoderProcessor, FixedOnlineValcoderProcessor, UltraFinalOnlineValcoderProcessor } from './onlineValcoderProcessor';

@Component({})
export default class ValcoderInput extends Vue {
    @Prop()
    onlineValcoderProcessor!: UltraFinalOnlineValcoderProcessor
    valcoderProcessor!: ValcoderProcessor


    get processingValue(): string {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getProcessingValue']
    }

    get valcoderStep(): number {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getValcoderStep']
    }

    get inputWindowData(): InputWindowData {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getInputWindowData']
    }

    get isItTime(): boolean {
        return Boolean(this.inputWindowData.isItTime)
    }

    get onlineValcoderFlag() {
        return this.inputWindowData.isItOnlineValcoder
    }

    mounted() {
        let newValue;
        if (this.isItTime) {
            newValue = TimeProcessor.toTime(TimeProcessor.toSeconds(this.processingValue))
        } else {
            newValue = +this.processingValue + '';
        }
        this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue);
        this.$emit('createValcoder')
        this.valcoderProcessor = new ValcoderProcessor(this.isItTime)
        this.initOnlineValcoderProcessor()
        // window.addEventListener('keypress', this.keyboardEventHandler)
    }

    initOnlineValcoderProcessor() {
        const valcoderElement = this.$refs.valcoder as HTMLBaseElement;
        if (valcoderElement) {
            const valcoderDiameter = valcoderElement.offsetWidth
            let pointRadius = (valcoderDiameter * 13 / 100) / 2;
            let pointX = valcoderDiameter * 8 / 100 - Math.round(valcoderDiameter / 2) + pointRadius;
            let pointY = Math.round(valcoderDiameter / 2) - valcoderDiameter * 60 / 100 - pointRadius;
            this.onlineValcoderProcessor.setInitCoords(pointX, pointY)
        } else {
            this.onlineValcoderProcessor.setInitCoords(128, 59.4)
        }

    }

    beforeDestroy() {
        this.$emit('destroyValcoder')
        // window.removeEventListener('keypress', this.keyboardEventHandler)
    }

    cancelButtonClick() {
        this.$store.commit('ourExtension/layoutsData/inputWindow/reset');
        this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow');
    }

    confirmButtonClick() {
        if (!this.onlineValcoderFlag) {
            this.$store.dispatch('ourExtension/layoutsData/inputWindow/confirm')
        } else {
            this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow')
        }
    }

    async keyboardEventHandler(e: KeyboardEvent) {  // Не использовать в обычном интерфейсе. Только для пульта
        const valcoderElement = this.$refs.valcoder as HTMLBaseElement;
        let newValue = null
        if (e.key === 'f') {
            newValue = await this.valcoderProcessor.keyboardEventProcessing(true, valcoderElement, this.processingValue, this.valcoderStep, this.inputWindowData)
        } else if (e.key === 'b') {
            newValue = await this.valcoderProcessor.keyboardEventProcessing(false, valcoderElement, this.processingValue, this.valcoderStep, this.inputWindowData)
        }
        if (newValue !== null) {
            this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
        }
    }

    mouseMoveHandler(e: MouseEvent) {
        if (this.valcoderProcessor) {
            const valcoderElement = this.$refs.valcoder as HTMLBaseElement;
            const targetElement = e.target as HTMLBaseElement;
            const newValue = this.valcoderProcessor.mouseMoveProcessing(e, valcoderElement, targetElement, this.processingValue, this.valcoderStep, this.inputWindowData)
            if (newValue !== null) {
                this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
            }
        }
    }

    touchHandler(e: TouchEvent) {
        if (this.valcoderProcessor) {
            const valcoderElement = this.$refs.valcoder as HTMLBaseElement;
            const valcoderCircleHolder = this.$refs.valcoderCircleHolder as HTMLBaseElement;
            const returnedData = this.valcoderProcessor.touchMoveProcessing(e, valcoderElement, valcoderCircleHolder, this.processingValue, this.valcoderStep, this.inputWindowData)
            if (returnedData !== null) {
                if (this.onlineValcoderProcessor) {
                    this.onlineValcoderProcessor.startProcessing(returnedData)
                }
            }
        }
    }

}
</script>