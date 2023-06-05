<template>
    <div class="big-coord-button">
        <label for="big-coord-button" class="coord-label">X</label>
        <div class="over">
            <button @click="minusClick" class="big-minus-button x"></button>
            <button @click="plusClick" class="big-plus-button x"></button>
        </div>
        <img src="@/layouts/move_layout/img/big_coord_button.png" height="100" />
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class XBigButton extends Vue {
    minusClick() {
        this.$emit('minusClick', 'X')
        // const oldCoordinates: CoordinatesHolder = this.$store.getters['ourExtension/layoutsData/moveWindow/getCoordinates']
        // const step = this.$store.getters['ourExtension/layoutsData/moveWindow/getCurrentStep']

        // const newValue = this.round(oldCoordinates.x - step);
        // this.$store.commit('ourExtension/layoutsData/moveWindow/setX', newValue)
    }

    plusClick() {
        this.$emit('plusClick', 'X')
        // const oldCoordinates: CoordinatesHolder = this.$store.getters['ourExtension/layoutsData/moveWindow/getCoordinates']
        // const step = this.$store.getters['ourExtension/layoutsData/moveWindow/getCurrentStep']
        // const newValue = this.round(oldCoordinates.x + step);
        // this.$store.commit('ourExtension/layoutsData/moveWindow/setX', newValue)
    }

    round(value: number) {
        return Math.round(+value * 10) / 10;
    }
}
</script>