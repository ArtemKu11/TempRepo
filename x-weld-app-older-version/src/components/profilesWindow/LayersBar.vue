<template>
    <div ref="layersBar" class="layouts-holder">
        <span>Слои</span>
        <div @mousemove="mousemoveHandler" class="layouts-icon-holder">
            <div @touchmove="touchmoveHandler" @touchstart="touchmoveHandler" @mousemove="mousemoveHandler" @mousedown="mousedownHandler" ref="rangeHolder" class="layouts-icon">
                <div class="invisible-clickable-div"></div>
                <div ref="range" class="range">
                    <div class="point up"></div>
                    <div class="point down"></div>
                </div>

            </div>
        </div>
        <button @click="openLayersSetup"><img src="@/layouts/profiles_layout/img/layouts_button.svg"></button>
    </div>
</template>


<script lang="ts">
import { Vue, Component, Model, Watch } from 'vue-property-decorator';
import { doubleRangeProcessor } from './doubleRangeProcessor';
import { FileData } from '@/store/ourExtension/files/types';

@Component({
    components: {

    },
})
export default class LayersBar extends Vue {
    mousedownFlag = true
    mousedownFlagKostyl = false;

    @Model('update:modelValue', { type: Object })
    modelValue!: any

    get file(): FileData {
        return this.$store.getters['ourExtension/layoutsData/profilesWindow/getFile']
    }

    get layersSetupFlag(): boolean {
        return this.$store.getters['ourExtension/layoutsData/profilesWindow/getLayersSetupWindowFlag']
    }

    @Watch('modelValue', { deep: true })
    modelWather() {
        if (!this.mousedownFlagKostyl) {
            const firstLayer = 0;
            const lastLayer = +this.file.layers
            const requiredFirstLayer = this.modelValue.cachedFirstLayer
            const requiredLastLayer = this.modelValue.cachedLastLayer
            const upperDiff = Math.abs(lastLayer - requiredLastLayer)
            const downDiff = Math.abs(firstLayer - requiredFirstLayer)
            const range = this.range
            if (range) {
                range.style.top = `${(upperDiff / lastLayer) * 100}%`
                range.style.bottom = `${((downDiff / lastLayer) * 100)}%`
            }
        }
    }

    mounted() {
        window.addEventListener('mouseup', () => {
            // this.mousedownFlag = false;
            this.mousedownFlagKostyl = false;
            doubleRangeProcessor.processingPoint = null
        })

        window.addEventListener('touchend', () => {
            // this.mousedownFlag = false;
            this.mousedownFlagKostyl = false;
            doubleRangeProcessor.processingPoint = null
        })
        this.modelWather()
    }

    mousedownHandler() {
        this.mousedownFlag = true
    }

    touchmoveHandler(e: TouchEvent) {
        const range = this.range;
        const rangeHolder = this.rangeHolder
        if (range && rangeHolder && this.layersSetupFlag) {
            const requiredY = e.touches[0].clientY;
            const [topPercent, bottomPersent] = doubleRangeProcessor.startProcessing(range, rangeHolder, requiredY)
            const firstLayer = 0;
            const lastLayer = +this.file.layers
            const newLastLayer = Math.round(lastLayer - (topPercent / 100 * lastLayer))
            const newFirstLayer = Math.round(firstLayer + (bottomPersent / 100 * lastLayer))
            this.$emit('update:modelValue', {cachedFirstLayer: newFirstLayer, cachedLastLayer: newLastLayer})
        }
    }

    mousemoveHandler(e: MouseEvent) {
        const range = this.range;
        const rangeHolder = this.rangeHolder
        if (range && rangeHolder && this.mousedownFlag && this.layersSetupFlag) {
            const requiredY = e.clientY
            const [topPercent, bottomPersent] = doubleRangeProcessor.startProcessing(range, rangeHolder, requiredY)
            const firstLayer = 0;
            const lastLayer = +this.file.layers
            const newLastLayer = Math.round(lastLayer - (topPercent / 100 * lastLayer))
            const newFirstLayer = Math.round(firstLayer + (bottomPersent / 100 * lastLayer))
            this.$emit('update:modelValue', {cachedFirstLayer: newFirstLayer, cachedLastLayer: newLastLayer})
        }
    }

    checkBorders() {
        
    }

    getAllParams(element: HTMLElement) {
        return [this.getUpperY(element), this.getDownY(element), this.getHeight(element)]
    }

    getUpperY(element: HTMLElement) {
        return element.getBoundingClientRect().y
    }

    getDownY(element: HTMLElement) {
        const height = element.getBoundingClientRect().height
        return this.getUpperY(element) + height
    }

    getHeight(element: HTMLElement) {
        return element.getBoundingClientRect().height
    }


    get range(): HTMLElement | null {
        const range = this.$refs.range as HTMLElement
        if (range) {
            return range
        }
        return null
    }

    get rangeHolder(): HTMLElement | null {
        const range = this.$refs.rangeHolder as HTMLElement
        if (range) {
            return range
        }
        return null
    }

    openLayersSetup() {
        this.$emit('openLayersSetup')
    }
}
</script>

<style lang="scss">
.layouts-icon {
    // margin-top: 10px !important;
}
</style>