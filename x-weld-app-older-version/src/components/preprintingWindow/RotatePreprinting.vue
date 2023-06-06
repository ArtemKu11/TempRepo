<template>
    <div class="content-center rotate-preprinting">
        <div id="left-container">
            <div id="polotno">
                <img src="@/layouts/preprinting_layout/img/polotno_for_scale.svg" width="369" height="293" alt="">
            </div>
            <div id="buttons-container">
                <button @click="switchToMovePreprinting">
                    <div class="img-wrapper">
                        <img src="@/layouts/preprinting_layout/img/for_points.svg">
                    </div>

                    <span>По четырем точкам</span>
                </button>
                <button>
                    <div class="img-wrapper">
                        <img src="@/layouts/preprinting_layout/img/pr_vvod_active.svg">
                    </div>
                    <span>Прямой ввод</span>
                </button>

            </div>
        </div>

        <div id="right-container">

            <div class="container-for-center-align">

                <div class="container">
                    <div class="title">
                        <span>Сдвиг</span>
                        <button @click="getCurrentCoordsClickHandler">
                            <div class="selected-img-wrapper">
                                <img src="@/layouts/preprinting_layout/img/selected.svg" alt="">
                            </div>
                            <span>Взять текущее</span>
                        </button>
                    </div>
                    <div class="parameter-string">
                        <button @click="keyboardClick('X')">
                            <div class="selected-img-wrapper">
                                <img src="@/layouts/preprinting_layout/img/keyboard.png" alt="">
                            </div>
                        </button>
                        <span class="coord-name">X</span>
                        <span class="coord-value">{{ dispacement.x }}</span>
                    </div>

                    <div class="parameter-string">
                        <button @click="keyboardClick('Y')">
                            <div class="selected-img-wrapper">
                                <img src="@/layouts/preprinting_layout/img/keyboard.png" alt="">
                            </div>
                        </button>
                        <span class="coord-name">Y</span>
                        <span class="coord-value">{{ dispacement.y }}</span>
                    </div>


                    <div class="parameter-string">
                        <button @click="keyboardClick('Z')">
                            <div class="selected-img-wrapper">
                                <img src="@/layouts/preprinting_layout/img/keyboard.png" alt="">
                            </div>
                        </button>
                        <span class="coord-name">Z</span>
                        <span class="coord-value">{{ dispacement.z }}</span>
                    </div>
                </div>


                <div class="container">
                    <div class="title">
                        <span>Поворот</span>
                    </div>
                    <div class="parameter-string">
                        <button @click="keyboardClick('Поворот')">
                            <div class="selected-img-wrapper">
                                <img src="@/layouts/preprinting_layout/img/keyboard.png" alt="">
                            </div>
                        </button>
                        <img class="coord-name" src="@/layouts/preprinting_layout/img/rotate.png" alt="">
                        <span class="coord-value">{{ rotateAngle }}°</span>
                    </div>
                </div>

                <div class="container">
                    <div class="title">
                        <span>Масштаб</span>
                    </div>
                    <div class="parameter-string">
                        <button @click="keyboardClick('Масштаб')">
                            <div class="selected-img-wrapper">
                                <img src="@/layouts/preprinting_layout/img/keyboard.png" alt="">
                            </div>
                        </button>
                        <img class="coord-name" src="@/layouts/preprinting_layout/img/scale.png" alt="">
                        <span class="coord-value">{{ scale }}</span>
                    </div>
                </div>

            </div>
            <!-- <div class="title">
                    <span>Сдвиг</span>
                    <button>
                        <img src="./img/selected.svg">
                        <span>Взять текущее</span>
                    </button>
                </div>

                <div class="parameter-string">
                    <div class="img-wrapper">
                        <img src="./img/keyboard.png">
                    </div>
                    <span class="coord-name">X</span>
                    <span class="coord-value">2999</span>
                </div>

                <div class="parameter-string">
                    <div class="img-wrapper">
                        <img src="" alt="">
                    </div>
                    <img class="coord-name" src="./img/rotate.png">
                    <span class="coord-value">-37.6°</span>
                </div> -->
        </div>
    </div>
</template>


<script lang="ts">
import WindowsMixin from '@/mixins/windows';
import { PreprintingWindowState, UsualCoords } from '@/store/ourExtension/layoutsData/preprintingWindow/types';
import { Vue, Component, Mixins } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class RotatePreprinting extends Mixins(WindowsMixin) {
    processingParameter = ''

    get preprintingWindowState(): PreprintingWindowState {
        return this.$store.state.ourExtension.layoutsData.preprintingWindow
    }

    get currentToolhedCoords(): UsualCoords {
        const coordsArr: number[] = this.$store.getters['ourExtension/layoutsData/moveWindow/getCoordinates']()
        return {
            x: coordsArr[0],
            y: coordsArr[1],
            z: coordsArr[2]
        }
    }

    get dispacement(): UsualCoords {
        return this.preprintingWindowState.dispacement
    }

    get rotateAngle(): number {
        return this.preprintingWindowState.rotateAngle
    }

    get scale(): number {
        return this.preprintingWindowState.scale
    }

    switchToMovePreprinting() {
        this.$emit('switchClick')
    }

    keyboardClick(parameterName: string) {
        let coordName = parameterName;
        const confirmCallback = this.newValueReceiver.bind(this)
        let defaultImplementation = false;
        let valcoderStep = 1
        if (coordName === 'Поворот') {
            coordName = 'Поворот, °'
            valcoderStep = 0.1
        }
        if (coordName === 'Масштаб') {
            valcoderStep = 0.1
        }
        if (['X', 'Y', 'Z'].includes(coordName)) {
            defaultImplementation = true
        }
        const initValue = this.resolveInitValue(parameterName)
        this.processingParameter = parameterName
        this.openInputWindow(defaultImplementation, coordName, initValue, valcoderStep, 'void', confirmCallback, 5000, -45, true)
    }

    resolveInitValue(parameterName: string) {
        let state = this.preprintingWindowState as any
        if (['X', 'Y', 'Z'].includes(parameterName)) {
            return state.dispacement[parameterName.toLowerCase()]
        } else {
            switch (parameterName) {
                case 'Поворот':
                    return state.rotateAngle
                case 'Масштаб':
                    return state.scale
                default:
                    break;
            }
        }
    }


    newValueReceiver(newValue: number) {
        let state = this.preprintingWindowState as any
        if (['X', 'Y', 'Z'].includes(this.processingParameter)) {
            state.dispacement[this.processingParameter.toLowerCase()] = newValue
        } else {
            switch (this.processingParameter) {
                case 'Поворот':
                    state.rotateAngle = newValue
                    break;
                case 'Масштаб':
                    state.scale = newValue
                    break;
                default:
                    break;
            }
        }
        this.processingParameter = ''
    }

    getCurrentCoordsClickHandler() {
        this.preprintingWindowState.dispacement = this.currentToolhedCoords
    }
}
</script>


<style lang="scss">
@import '@/layouts/preprinting_layout/css/sdvig_povorot_scale.scss';
</style>