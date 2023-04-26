<template>
    <div class="content-container preprinting-move">
        <div id="content-header">
            <span>Перемещение / сдвиг / поворот</span>
        </div>
        <MovePreprinting @switchClick="switchToRotatePreprinting" v-if="movePreprintingFlag"/>
        <RotatePreprinting @switchClick="switchToMovePreprinting" v-if="!movePreprintingFlag" />
    </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MovePreprinting from './MovePreprinting.vue'
import RotatePreprinting from './RotatePreprinting.vue'

@Component({
    components: {
        MovePreprinting, RotatePreprinting
    },
})
export default class PreprintingWindow extends Vue {
    movePreprintingFlag = true

    switchToMovePreprinting() {
        this.movePreprintingFlag = true
    }

    switchToRotatePreprinting() {
        this.movePreprintingFlag = false
    }
}
</script>


<style lang="scss">
@import '@/layouts/preprinting_layout/css/last_layout.scss';
</style>