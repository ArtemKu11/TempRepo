<template>
    <div id="scrollbar-container">
        <span>Шаг (мм)</span>
        <input type="range" step="0.5" :value="currentStep" @change="changeHandler">
        <div id="values">
            <span>0,1</span>
            <span>0,5</span>
            <span>1,0</span>
            <span>2,0</span>
            <span>5,0</span>
            <span>10,0</span>
            <span>50,0</span>
        </div>

    </div>
</template>


<script lang="ts">
import { StepSelectorInfo } from '@/store/ourExtension/layoutsData/moveWindow/types';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class StepSelector extends Vue {

    stepSelectorInfo: StepSelectorInfo = this.$store.getters['ourExtension/layoutsData/moveWindow/getStepSelectorInfo'];

    get currentStep(): number {
        const step = this.$store.getters['ourExtension/layoutsData/moveWindow/getCurrentStep']
        const index = this.stepSelectorInfo.stepValues.indexOf(step);
        if (index !== -1) {
            return this.stepSelectorInfo.percentValues[index]
        }
        return this.stepSelectorInfo.percentValues[0]
    }

    changeHandler(e: Event) {
        const el = e.target as HTMLInputElement;
        const newPercentValue = Math.round(+el.value);
        const nearIndex = this.findNearIndex(newPercentValue, this.stepSelectorInfo.percentValues);
        const newStep = this.stepSelectorInfo.stepValues[nearIndex];
        this.$store.commit('ourExtension/layoutsData/moveWindow/setCurrentStep', newStep + 1)
        this.$store.commit('ourExtension/layoutsData/moveWindow/setCurrentStep', newStep)
    }

    findNearIndex(value: number, array: Array<number>) {
        let minDiff = 100;
        let minIndex = 0;
        array.forEach((constValue, index) => {
            let diff = Math.abs(constValue - value);
            if (diff < minDiff) {
                minDiff = diff;
                minIndex = index;
            }
        })
        return minIndex;
    }
}
</script>


<style lang="scss"></style>