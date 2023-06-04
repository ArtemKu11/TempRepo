<template>
    <div class="content-center move-preprinting">
        <div id="left-container">
            <div id="polotno">
                <img src="@/layouts/preprinting_layout/img/polotno_for_moving.svg" width="369" height="293" alt="">
            </div>
            <div id="buttons-container">
                <button class="for-points-input">
                    <div class="img-wrapper">
                        <img src='@/layouts/preprinting_layout/img/for_points_active.svg'>
                    </div>

                    <span>По четырем точкам</span>
                </button>
                <button @click="switchToRotatePreprinting" class="direct-input" :class="{
                    'active': allowSelectFromFile,
                    'deactive': !allowSelectFromFile
                }">
                    <div class="img-wrapper">
                        <img src="@/layouts/preprinting_layout/img/pr_vvod.svg">
                    </div>
                    <span>Прямой ввод</span>
                </button>

            </div>
        </div>

        <div id="right-container">
            <div id="upper">
                <div class="checkbox-wrapper">
                    <span class="first-checkbox-span" :class="{ 'active': initPoints }">Исходные</span>
                    <div class="custom-checkbox" :class="{ 'active': !initPoints }" @click="checkboxClickHandler">
                        <div class="checkbox-point"></div>
                    </div>
                    <span class="second-checkbox-span" :class="{ 'active': !initPoints }">Целевые</span>
                </div>

                <div class="parameter-string">
                    <div class="wrapper"><img :src="firstPointLogo"></div>
                    <div class="button-and-coord-wrapper">
                        <button @click="keyboardClick('X', 1)">
                            <img src="@/layouts/preprinting_layout/img/keyboard.png">
                        </button>
                        <span class="coord-name">X</span>
                        <span class="coord-value">{{ firstPointCoords.x }}</span>
                    </div>
                </div>

                <div class="parameter-string">
                    <div class="wrapper">
                        <button @click="getCurrentCoordsClickHandler('first')" class="select-current">
                            <div class="img-wrapper">
                                <img src="@/layouts/preprinting_layout/img/selected.svg">
                            </div>
                            <span>Взять текущее</span>
                        </button>
                    </div>
                    <div class="button-and-coord-wrapper">
                        <button @click="keyboardClick('Y', 1)">
                            <img src="@/layouts/preprinting_layout/img/keyboard.png">
                        </button>
                        <span class="coord-name">Y</span>
                        <span class="coord-value">{{ firstPointCoords.y }}</span>
                    </div>
                </div>

                <div class="parameter-string">
                    <div class="wrapper">
                        <button class="select-from-file" :class="{
                            'active': allowSelectFromFile,
                            'deactive': !allowSelectFromFile
                        }">
                            <div class="img-wrapper">
                                <img src="@/layouts/preprinting_layout/img/selected.svg">
                            </div>
                            <span>Взять из файла</span>
                        </button>
                    </div>
                    <div class="button-and-coord-wrapper">
                        <button @click="keyboardClick('Z', 1)">
                            <img src="@/layouts/preprinting_layout/img/keyboard.png">
                        </button>
                        <span class="coord-name">Z</span>
                        <span class="coord-value">{{ firstPointCoords.z }}</span>
                    </div>
                </div>
            </div>
            <div id="upper">
                <div class="parameter-string">
                    <div class="wrapper"><img :src="secondPointLogo"></div>
                    <div class="button-and-coord-wrapper">
                        <button @click="keyboardClick('X', 2)">
                            <img src="@/layouts/preprinting_layout/img/keyboard.png">
                        </button>
                        <span class="coord-name">X</span>
                        <span class="coord-value">{{ secondPointCoords.x }}</span>
                    </div>
                </div>

                <div class="parameter-string">
                    <div class="wrapper">
                        <button @click="getCurrentCoordsClickHandler('second')" class="select-current">
                            <div class="img-wrapper">
                                <img src="@/layouts/preprinting_layout/img/selected.svg">
                            </div>
                            <span>Взять текущее</span>
                        </button>
                    </div>
                    <div class="button-and-coord-wrapper">
                        <button @click="keyboardClick('Y', 2)">
                            <img src="@/layouts/preprinting_layout/img/keyboard.png">
                        </button>
                        <span class="coord-name">Y</span>
                        <span class="coord-value">{{ secondPointCoords.y }}</span>
                    </div>
                </div>

                <div class="parameter-string">
                    <div class="wrapper">
                        <button class="select-from-file" :class="{
                            'active': allowSelectFromFile,
                            'deactive': !allowSelectFromFile
                        }">
                            <div class="img-wrapper">
                                <img src="@/layouts/preprinting_layout/img/selected.svg">
                            </div>
                            <span>Взять из файла</span>
                        </button>
                    </div>
                    <div class="button-and-coord-wrapper">
                        <button @click="keyboardClick('Z', 2)">
                            <img src="@/layouts/preprinting_layout/img/keyboard.png">
                        </button>
                        <span class="coord-name">Z</span>
                        <span class="coord-value">{{ secondPointCoords.z }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import WindowsMixin from '@/mixins/windows';
import { PreprintingWindowState, UsualCoords } from '@/store/ourExtension/layoutsData/preprintingWindow/types';
import { Component, Mixins } from 'vue-property-decorator';


@Component({})
export default class MovePreprinting extends Mixins(WindowsMixin) {
    initPoints = true;
    firstPointLogo = require('@/layouts/preprinting_layout/img/a1.svg')
    secondPointLogo = require("@/layouts/preprinting_layout/img/a2.svg")
    processingParameter = ''

    get currentToolhedCoords(): UsualCoords {
        const coordsArr: number[] = this.$store.getters['ourExtension/layoutsData/moveWindow/getCoordinates']()
        return {
            x: coordsArr[0],
            y: coordsArr[1],
            z: coordsArr[2]
        }
    }

    get preprintingWindowState(): PreprintingWindowState {
        return this.$store.state.ourExtension.layoutsData.preprintingWindow
    }

    get firstPointCoords(): UsualCoords {
        if (this.initPoints) {
            return this.preprintingWindowState.a1Coords
        } else {
            return this.preprintingWindowState.b1Coords
        }
    }

    get secondPointCoords(): UsualCoords {
        if (this.initPoints) {
            return this.preprintingWindowState.a2Coords
        } else {
            return this.preprintingWindowState.b2Coords
        }
    }

    get allowSelectFromFile(): boolean {
        const fileInitFlag = this.$store.getters['ourExtension/layoutsData/preprintingWindow/isFileInit']()
        const file = this.$store.getters['ourExtension/layoutsData/preprintingWindow/getFile']()
        // return (fileInitFlag && file)
        return true
    }

    getCurrentCoordsClickHandler(point: string) {
        switch (point) {
            case 'first':
                if (this.initPoints) {
                    this.preprintingWindowState.a1Coords = this.currentToolhedCoords
                } else {
                    this.preprintingWindowState.b1Coords = this.currentToolhedCoords
                }
                break;
            case 'second':
                if (this.initPoints) {
                    this.preprintingWindowState.a2Coords = this.currentToolhedCoords
                } else {
                    this.preprintingWindowState.b2Coords = this.currentToolhedCoords
                }
                break;
            default:
                break;
        }
    }

    checkboxClickHandler() {
        this.initPoints = !this.initPoints
        if (!this.initPoints) {
            this.firstPointLogo = require('@/layouts/preprinting_layout/img/b1.svg')
            this.secondPointLogo = require("@/layouts/preprinting_layout/img/b2.svg")
        } else {
            this.firstPointLogo = require('@/layouts/preprinting_layout/img/a1.svg')
            this.secondPointLogo = require("@/layouts/preprinting_layout/img/a2.svg")
        }
    }

    switchToRotatePreprinting() {
        if (this.allowSelectFromFile) this.$emit('switchClick')
    }

    keyboardClick(coordName: string, pointNumber: number) {
        const [pointName, parameterName] = this.resolvePointAndParameterName(coordName, pointNumber)
        const confirmCallback = this.newValueReceiver.bind(this)
        const requiredCoords = this.getCoordsByPointName(pointName) as any
        const initValue = requiredCoords[coordName.toLowerCase()]
        this.processingParameter = parameterName
        this.openInputWindow(true, coordName, initValue, 1, 'void', confirmCallback, 5000, -45, true, 'Точка ' + pointName)
    }

    resolvePointAndParameterName(coordName: string, pointNumber: number) {
        if (this.initPoints) {
            return [`A${pointNumber}`, `A${pointNumber} ${coordName}`]

        } else {
            return [`B${pointNumber}`, `B${pointNumber} ${coordName}`]
        }
    }

    newValueReceiver(newValue: number) {
        let [pointName, coordName] = this.processingParameter.split(' ')
        coordName = coordName.toLowerCase()
        const requiredCoords = this.getCoordsByPointName(pointName) as any
        if (['x', 'y', 'z'].includes(coordName) && requiredCoords) {
            requiredCoords[coordName] = newValue
        }
        this.processingParameter = ''
    }

    getCoordsByPointName(pointName: string) {
        pointName = pointName.toUpperCase()
        const state = this.preprintingWindowState
        switch (pointName) {
            case 'A1':
                return state.a1Coords
            case 'A2':
                return state.a2Coords
            case 'B1':
                return state.b1Coords
            case 'B2':
                return state.b2Coords
            default:
                break;
        }
    }


}
</script>