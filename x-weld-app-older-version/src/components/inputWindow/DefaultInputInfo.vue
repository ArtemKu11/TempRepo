<template>
    <div class="input-info-part">
        <div class="holder">
            <span id="label-coord">{{ inputWindowData.coordName }}</span>
            <span id="label-value">{{ processingValue }}</span>
            <span id="label-mills">мм</span>
        </div>
    </div>
</template>


<script lang="ts">
import { InputWindowData } from '@/store/ourExtension/layoutsData/inputWindow/types';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class extends Vue {
    get inputWindowData(): InputWindowData {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getInputWindowData']
    }

    get processingValue(): string {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getProcessingValue']
    }
}
</script>