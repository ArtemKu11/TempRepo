<template>
    <div class="big-coord-button">
        <label for="big-coord-button" class="coord-label">Y</label>
        <div class="over transposed">
            <button @click="plusClick" class="big-plus-button"></button>
            <button @click="minusClick" class="big-minus-button"></button>
        </div>
        <img src="@/layouts/move_layout/img/big_coord_button_transposed.png" height="100" />
    </div>
</template>


<script lang="ts">
import { CoordinatesHolder } from '@/store/ourExtension/layoutsData/moveWindow/types';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class YBigButton extends Vue {
    minusClick() {
        this.$emit('minusClick', 'Y')

        // const oldCoordinates: CoordinatesHolder = this.$store.getters['ourExtension/layoutsData/moveWindow/getCoordinates']
        // const step = this.$store.getters['ourExtension/layoutsData/moveWindow/getCurrentStep']

        // const newValue = this.round(oldCoordinates.y - step);
        // this.$store.commit('ourExtension/layoutsData/moveWindow/setY', newValue)
    }

    plusClick() {
        this.$emit('plusClick', 'Y')
        // const oldCoordinates: CoordinatesHolder = this.$store.getters['ourExtension/layoutsData/moveWindow/getCoordinates']
        // const step = this.$store.getters['ourExtension/layoutsData/moveWindow/getCurrentStep']
        // const newValue = this.round(oldCoordinates.y + step);
        // this.$store.commit('ourExtension/layoutsData/moveWindow/setY', newValue)
    }

    round(value: number) {
        return Math.round(+value * 10) / 10;
    }
}
</script>