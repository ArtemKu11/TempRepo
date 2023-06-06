<template>
    <div ref="layersSetup" id="layout-setup">
        <div id="layout-info-holder">
            <button @click="firstLayerClick">
                <span>{{ firstLayer }}</span>
                <div class="underline"></div>
                <span>Начальный слой</span>
            </button>
            <button @click="lastLayerClick">
                <span>{{ lastLayer }}</span>
                <div class="underline"></div>
                <span>Конечный слой</span>
            </button>
        </div>
        <div id="layout-buttons-holder">

            <button @click="addDiapason" class="diapason-button add" :class="{ 'deactive': !addDiapasonFlag }">
                <img src="@/layouts/profiles_layout/img/add_diapason.svg">
                <span>Добавить диапазон</span>
            </button>
            <button @click="deleteCurrent" class="diapason-button delete"
                :class="{ 'deactive': selectedDiapason.isRootDiapason }">
                <img src="@/layouts/profiles_layout/img/delete_diapason.svg">
                <span>Удалить диапазон</span>
            </button>
            <button @click="deleteAll" class="diapason-button delete-all"
                :class="{ 'deactive': !(selectedDiapason.nextDiapason || selectedDiapason.prevDiapason) }">
                <img src="@/layouts/profiles_layout/img/delete_all_diapasones.svg">
                <span>Удалить все диапазоны</span>
            </button>
            <button @click="nextDiapason" class="diapason-button next"
                :class="{ 'deactive': !selectedDiapason.nextDiapason }">
                <img src="@/layouts/profiles_layout/img/next_diapason.svg">
                <span>Следующий диапазон</span>
            </button>
            <button @click="prevDiapason" class="diapason-button prev"
                :class="{ 'deactive': !selectedDiapason.prevDiapason }">
                <img src="@/layouts/profiles_layout/img/prev_diapason.svg">
                <span>Предыдущий диапазон</span>
            </button>
        </div>

    </div>
</template>


<script lang="ts">
import { Waits } from '@/globals';
import { FileData } from '@/store/ourExtension/files/types';
import { InputWindowData, InitInputWindowData } from '@/store/ourExtension/layoutsData/inputWindow/types';
import { printingDiapasonProcessor } from '@/store/ourExtension/profiles/helpers';
import { PrintingDiapason, Profile } from '@/store/ourExtension/profiles/types';
import { Component, Model, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class LayersSetup extends Vue {
    // addDiapasonFlag = false;
    addDiapasonFlag = true;

    firstLayer = 0;
    lastLayer = 0;
    selectedDiapason: PrintingDiapason = this.getSelectedDiapason();

    @Model('update:modelValue', { type: Object })
    modelValue!: any

    @Watch('modelValue', { deep: true })
    modelWather() {
        this.firstLayer = this.modelValue.cachedFirstLayer
        this.lastLayer = this.modelValue.cachedLastLayer

        // if (this.firstLayer === this.getInitFirstLayer() && this.lastLayer === this.getInitLastLayer()) {
        //     this.addDiapasonFlag = false
        // } else {
        //     this.addDiapasonFlag = true
        // }
    }

    getSelectedDiapason(): PrintingDiapason {
        return this.$store.state.ourExtension.layoutsData.profilesWindow.selectedDiapason
    }

    get file(): FileData {
        return this.$store.getters['ourExtension/layoutsData/profilesWindow/getFile']
    }

    mounted() {
        this.selectedDiapason = this.getSelectedDiapason()
        this.refreshLayers()
    }


    refreshLayers() {
        this.firstLayer = this.getInitFirstLayer();
        this.lastLayer = this.getInitLastLayer();
    }

    getInitLastLayer(): number {
        if (this.selectedDiapason.lastLayer) {
            return this.selectedDiapason.lastLayer
        } else {
            return +this.file.layers
        }
    }

    getInitFirstLayer(): number {
        if (this.selectedDiapason.firstLayer) {
            return this.selectedDiapason.firstLayer
        } else {
            return 0;
        }
    }

    firstLayerClick() {
        const confirmCallback = this.newFirstLayerReceiver.bind(this);
        const maxValue = this.lastLayer - 1;
        const minValue = 0;
        this.openInputWindow(this.firstLayer, confirmCallback, 'Начальный слой', maxValue, minValue, 1, true)
    }

    lastLayerClick() {
        const confirmCallback = this.newLastLayerReceiver.bind(this);
        const maxValue = +this.file.layers;
        const minValue = this.firstLayer + 1;
        this.openInputWindow(this.lastLayer, confirmCallback, 'Начальный слой', maxValue, minValue, 1, true)
    }

    openInputWindow(initValue: number, confirmCallback: Function, coordName: string, maxValue: number, minValue: number, valcoderStep: number, rejectPointClick: boolean) {
        const inputWindowData: InputWindowData = {
            coordName: coordName,
            initValue: initValue,
            dispachAfterConfirm: `void`,
            callbackAfterConfirm: confirmCallback,
            maxValue: maxValue,
            minValue: minValue,
            rejectPointClick: rejectPointClick
        }
        const initInfo: InitInputWindowData = {
            inputWindowData: inputWindowData,
            valcoderStep: valcoderStep,
        }
        this.$store.dispatch('ourExtension/layoutsData/inputWindow/initNotDefaultInputWindow', initInfo);
        this.$store.dispatch('ourExtension/windowFlags/openInputWindow');
    }

    newFirstLayerReceiver(newValue: number) {
        if (newValue < this.lastLayer) {
            this.firstLayer = newValue
            this.modelValue.cachedFirstLayer = newValue
        }
    }

    newLastLayerReceiver(newValue: number) {
        if (newValue > this.firstLayer) {
            this.lastLayer = newValue
            this.modelValue.cachedLastLayer = newValue
        }
    }

    addDiapason() {
        this.$store.dispatch('ourExtension/layoutsData/profilesWindow/addDiapason', { firstLayer: this.firstLayer, lastLayer: this.lastLayer })
        this.forceUpdate()
    }

    prevDiapason() {
        this.$store.dispatch('ourExtension/layoutsData/profilesWindow/prevDiapason')
        this.forceUpdate()
    }

    nextDiapason() {
        if (this.selectedDiapason.nextDiapason) {
            this.$store.dispatch('ourExtension/layoutsData/profilesWindow/nextDiapason')
            this.forceUpdate()
        }

    }

    deleteCurrent() {
        if (!this.selectedDiapason.isRootDiapason) {
            this.$store.dispatch('ourExtension/layoutsData/profilesWindow/deleteCurrent')
            this.forceUpdate()
        }
    }

    deleteAll() {
        if (this.selectedDiapason.nextDiapason || this.selectedDiapason.prevDiapason) {
            this.$store.dispatch('ourExtension/layoutsData/profilesWindow/deleteAll')
            this.forceUpdate()
        }
    }

    forceUpdate() {
        this.selectedDiapason = this.getSelectedDiapason()
        this.refreshLayers()
        this.forceUpdateParent()
        this.$forceUpdate()
        this.acualizeModel()
    }

    forceUpdateParent() {
        this.$emit('forceUpdate')
    }

    beforeDestroy() {
        this.acualizeModel()
    }

    acualizeModel() {
        this.modelValue.cachedFirstLayer = this.getInitFirstLayer()
        this.modelValue.cachedLastLayer = this.getInitLastLayer()
    }
}
</script>

<style>
.button-mock {
    height: 70px;
}
</style>