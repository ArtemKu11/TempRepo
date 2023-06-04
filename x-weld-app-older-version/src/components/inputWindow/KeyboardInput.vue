<template>
    <div id="keyboard-input-resources">
        <div id="keyboard">
            <button @click="plusButtonClick">+</button>
            <button @click="minusButtonClick"><img src="@/layouts/move_layout/img/tire.png"></button>
            <button @click="pointButtonClick"><img src="@/layouts/move_layout/img/mini-tire.png"></button>
            <button @click="digitButtonClick('1')">1</button>
            <button @click="digitButtonClick('2')">2</button>
            <button @click="digitButtonClick('3')">3</button>
            <button @click="digitButtonClick('4')">4</button>
            <button @click="digitButtonClick('5')">5</button>
            <button @click="digitButtonClick('6')">6</button>
            <button @click="digitButtonClick('7')">7</button>
            <button @click="digitButtonClick('8')">8</button>
            <button @click="digitButtonClick('9')">9</button>
            <button @click="deleteButtonClick"><img src="@/layouts/move_layout/img/delete_keyboard_button.png"></button>
            <button @click="digitButtonClick('0')">0</button>
            <button @click="confirmButtonClick"><img src="@/layouts/move_layout/img/confirm-keyboard-button.png"></button>
        </div>
    </div>
</template>


<script lang="ts">
import { InputWindowData } from '@/store/ourExtension/layoutsData/inputWindow/types';
import { Vue, Component } from 'vue-property-decorator';
import { TimeProcessor } from './timeProcessor';

@Component({})
export default class KeyboardInput extends Vue {
    get processingValue(): string {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getProcessingValue']
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

    lengthCheck() {
        const currentValue = this.processingValue;
        if (currentValue.includes(".")) {
            const pointIndex = currentValue.indexOf('.');
            const rightSide = currentValue.slice(pointIndex);
            return rightSide.length < 2
        }
        return ((Math.round(Math.abs(+currentValue)) + "").length < 5)
    }

    maxMinValueCheck(newValue: string): string {
        const maxValue = this.inputWindowData.maxValue;
        const minValue = this.inputWindowData.minValue;
        if (typeof maxValue === 'number' && +newValue > maxValue) {
            newValue = maxValue + '';
        }

        if (typeof minValue === 'number' && +newValue < minValue && minValue < 0) {
            newValue = minValue + '';
        }

        return newValue;
    }

    finalMaxMinValueCheck(newValue: string): string {
        const maxValue = this.inputWindowData.maxValue;
        const minValue = this.inputWindowData.minValue;
        if (typeof maxValue === 'number' && +newValue > maxValue) {
            newValue = maxValue + '';
        }

        if (typeof minValue === 'number' && +newValue < minValue) {
            newValue = minValue + '';
        }

        return newValue;
    }

    confirmButtonClick() {
        let newValue;
        if (this.isItTime) {
            newValue = TimeProcessor.confirm(this.processingValue, this.inputWindowData.maxValue, this.inputWindowData.minValue)
        } else {
            newValue = this.finalMaxMinValueCheck(this.processingValue)
        }
        this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
        if (!this.onlineValcoderFlag) {
            this.$store.dispatch('ourExtension/layoutsData/inputWindow/confirm')
        } else {
            this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow')
        }
    }

    digitButtonClick(digitValue: string) {
        if (this.isItTime) {
            const newValue = TimeProcessor.digitButton(this.processingValue, digitValue, this.inputWindowData.maxValue, this.inputWindowData.minValue)
            this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
            return;
        }
        if (!this.lengthCheck()) {
            return;
        }

        let newValue = +(this.processingValue + digitValue) + '';
        if (newValue === "") {
            newValue = '0';
        }
        newValue = this.maxMinValueCheck(newValue)
        this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
    }

    deleteButtonClick() {
        if (this.isItTime) {
            const newValue = TimeProcessor.deleteButton(this.processingValue)
            this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
            return;
        }

        const currentValue = this.processingValue;
        let newValue = (currentValue + "").slice(0, (currentValue + "").length - 1);
        if (newValue === "" || newValue === "-") {
            newValue = "0";
        }
        if (newValue.endsWith('.')) {
            this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
        } else {
            this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', (+newValue + ''))
        }
    }

    pointButtonClick() {
        if (this.isItTime) {
            return;
        }

        if (this.inputWindowData.rejectPointClick) {
            return
        }
        const currentValue = this.processingValue;
        if (!currentValue.includes('.')) {
            const newValue = currentValue + ".";
            this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
        }
    }

    plusButtonClick() {
        if (this.isItTime) {
            return;
        }

        const currentValue = this.processingValue;
        let firstDigit = (currentValue).charAt(0);
        if ((firstDigit === '-') && currentValue.length > 1) {
            let newValue = currentValue.slice(1);
            newValue = this.maxMinValueCheck(newValue)
            if (newValue.endsWith('.')) {
                this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
            } else {
                this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', (+newValue + ''))
            }
        }
    }

    minusButtonClick() {
        if (this.isItTime) {
            return;
        }

        const currentValue = this.processingValue;
        let firstDigit = currentValue.charAt(0);
        if (!(firstDigit === '-') && currentValue !== "0") {
            let newValue = '-' + currentValue;
            newValue = this.maxMinValueCheck(newValue)
            if (newValue.endsWith('.')) {
                this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
            } else {
                this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', (+newValue + ''))
            }
        }
    }
}
</script>