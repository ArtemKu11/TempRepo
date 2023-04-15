<template>
    <div class="big-coord-button">
        <label for="big-coord-button" class="coord-label">Z</label>
        <div class="over transposed">
            <button @click="minusClick" class="big-minus-button"></button>
            <button @click="plusClick" class="big-plus-button"></button>
        </div>
        <img src="@/layouts/move_layout/img/big_coord_button_transposed.png" height="100" />
    </div>
</template>


<script lang="ts">
import { CoordinatesHolder } from '@/store/ourExtension/layoutsData/moveWindow/types';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class ZBigButton extends Vue {
    minusClick() {
        this.$emit('minusClick', 'Z')

        // const oldCoordinates: CoordinatesHolder = this.$store.getters['ourExtension/layoutsData/moveWindow/getCoordinates']
        // const step = this.$store.getters['ourExtension/layoutsData/moveWindow/getCurrentStep']

        // const newValue = this.round(oldCoordinates.z - step);
        // this.$store.commit('ourExtension/layoutsData/moveWindow/setZ', newValue)
    }

    plusClick() {
        this.$emit('plusClick', 'Z')

        // const oldCoordinates: CoordinatesHolder = this.$store.getters['ourExtension/layoutsData/moveWindow/getCoordinates']
        // const step = this.$store.getters['ourExtension/layoutsData/moveWindow/getCurrentStep']
        // const newValue = this.round(oldCoordinates.z + step);
        // this.$store.commit('ourExtension/layoutsData/moveWindow/setZ', newValue)
    }

    round(value: number) {
        return Math.round(+value * 10) / 10;
    }
}
</script>