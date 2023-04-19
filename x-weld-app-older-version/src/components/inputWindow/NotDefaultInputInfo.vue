<template>
    <div class="input-info-part">
        <div class="holder">
            <span id="label-value">{{ processingValue }}</span>
            <span id="label-mills">{{ inputWindowData.coordName }}</span>
        </div>
    </div>
</template>


<script lang="ts">
import { InputWindowData } from '@/store/ourExtension/layoutsData/inputWindow/types';
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class NotDefaultInputInfo extends Vue {
    get inputWindowData(): InputWindowData {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getInputWindowData']
    }

    get processingValue(): string {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getProcessingValue']
    }
}
</script>


<style lang="scss"></style>