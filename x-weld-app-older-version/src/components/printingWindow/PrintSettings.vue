<template>
    <div id="print-settings">
        <div id="print-settings-content">

            <div class="parameter-string">
                <Parameter :name="'Применять сдвиг параметров ко всем слоям'"
                    v-model="printingSettings.shiftForAllLayers" />
            </div>

            <div class="parameter-string">
                <Parameter :name="'Установить паузу между слоями'" v-model="printingSettings.pauseBetweenLayers" />
                <div @click="parameterClickHandler('Установить паузу между слоями', 'pauseValue')" class="button">
                    <div class="img-wrapper">
                        <img src="@/layouts/print_layout/img/keyboard.png">
                    </div>
                    <span class="value">{{ pauseValue }}</span>
                    <span class="units">Сек</span>
                </div>
            </div>

            <div class="parameter-string">
                <Parameter :name="'Установить следующий слой'" v-model="printingSettings.setNextLayer" />
                <div @click="parameterClickHandler('Установить следующий слой', 'nextLayerValue')" class="button">
                    <div class="img-wrapper">
                        <img src="@/layouts/print_layout/img/keyboard.png">
                    </div>
                    <span class="value">{{ printingSettings.nextLayerValue }}</span>
                </div>
            </div>

        </div>
    </div>
</template>


<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
import Parameter from './Parameter.vue';
import { PrintingSettings } from '@/store/ourExtension/layoutsData/printingWindow/types';
import WindowsMixin from '@/mixins/windows';
import { PrintingDiapasonForMoonraker } from '@/store/ourExtension/profiles/types';
import { FileData } from '@/store/ourExtension/files/types';
import { TimeProcessor } from '../inputWindow/timeProcessor';

@Component({
    components: {
        Parameter
    },
})
export default class PrintSettings extends Mixins(WindowsMixin) {

    processingSetter = ''

    get printingSettings(): PrintingSettings {
        return this.$store.getters['ourExtension/layoutsData/printingWindow/getPrintingSettings']
    }

    get shiftForAllLayers() {
        return this.printingSettings.shiftForAllLayers
    }

    get pauseBetweenLayers() {
        return this.printingSettings.pauseBetweenLayers
    }

    get pauseValue() {
        return this.printingSettings.pauseValue
    }

    set pauseValue(newValue: string) {
        this.printingSettings.pauseValue = newValue
    }

    get setNextLayer() {
        return this.printingSettings.setNextLayer
    }

    get nextLayerValue(): number {
        return this.printingSettings.nextLayerValue
    }

    set nextLayerValue(newValue: number) {
        this.printingSettings.nextLayerValue = newValue
    }

    get printingDiapason(): PrintingDiapasonForMoonraker {
        return this.$store.getters['ourExtension/layoutsData/printingWindow/getPrintingDiapason']()
    }

    get file(): FileData {
        return this.$store.getters['ourExtension/layoutsData/printingWindow/getFile']()
    }

    @Watch('shiftForAllLayers')
    replaceForAllLayersWather() {
        console.log('1')
    }

    @Watch('pauseBetweenLayers')
    pauseBetweenLayersWather() {
        console.log('2')
    }

    @Watch('setNextLayer')
    setNextLayerWather() {
        console.log('3')
    }


    parameterClickHandler(parameterName: string, setter: string) {
        let isItTime = false
        if (setter === 'pauseValue') {
            isItTime = true
            console.log(TimeProcessor.deleteButton('11:11'))
        }
        const valcoderStep = 1
        let rejectPoint = true
        this.processingSetter = setter
        let initValue = 0
        const [minValue, maxValue] = this.resolveMinMaxValue()
        if (setter in this) {
            const context = this as any
            initValue = context[setter]
        }
        const callback = this.newValueReceiver.bind(this)
        if (valcoderStep / valcoderStep !== 1) {
            rejectPoint = false
        }
        this.openInputWindow(false, parameterName, initValue, valcoderStep, 'void', callback, maxValue, minValue, rejectPoint, '', isItTime)
    }

    newValueReceiver(newValue: number) {
        if (this.processingSetter in this) {
            const context = this as any
            if (this.processingSetter === 'pauseValue') {
                console.log(newValue)
                context[this.processingSetter] = TimeProcessor.toTime(newValue)
            } else {
                context[this.processingSetter] = newValue
            }
        }
        this.processingSetter = ''
    }

    resolveMinMaxValue(): Array<number | undefined> {
        if (this.processingSetter === 'pauseValue') {
            return [0, 3599]
        }

        let minValue = 0
        let maxValue;

        if (this.printingDiapason.firstLayer) {
            minValue = this.printingDiapason.firstLayer
        }

        if (this.printingDiapason.lastLayer) {
            maxValue = this.printingDiapason.lastLayer
        } else {
            const lastLayer = this.file.layers
            if (!isNaN(parseInt(lastLayer + ''))) {
                maxValue = +lastLayer
            }
        }
        return [minValue, maxValue]
    }
}
</script>