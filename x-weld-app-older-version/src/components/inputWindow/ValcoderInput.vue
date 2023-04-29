<template>
    <div id="valcoder-input-resources">
        <div id="valcoder">
            <img src="@/layouts/move_layout/img/valcoder_strelka.png" />
            <div id="plus-minus-holder">
                <span>-</span>
                <span>+</span>
            </div>
            <div ref="valcoderCircleHolder" id="valcoder-circle-holder">
                <div @mousedown.prevent="mousedownFlag = true"
                    @mousemove.prevent="mouseMoveHandler" @touchmove.prevent="touchHandler" id="valcoder-circle">
                    <div ref="valcoder" id="valcoder-invisible-circle">
                        <div ref="valcoderPoint" id="valcoder-point"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="confirm-buttons">
            <button @click="cancelButtonClick"><img
                    src="@/layouts/move_layout/img/cancel_button.png"><span>Отменить</span></button>
            <button @click="confirmButtonClick"><img
                    src="@/layouts/move_layout/img/save_button.png"><span>Сохранить</span></button>
        </div>
    </div>
</template>


<script lang="ts">
import state from '@/mixins/state';
import { InputWindowData } from '@/store/ourExtension/layoutsData/inputWindow/types';
import { Vue, Component } from 'vue-property-decorator';
import { TimeProcessor } from './timeProcessor';
import { InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers';

@Component({})
export default class ValcoderInput extends Vue {
    mousedownFlag = false
    lastCoords = {
        xCoord: 0,
        yCoord: 0,
    }
    angle: number = 0
    lastBorderAngle: number = 0
    valcoderCenterX: number = 0
    valcoderCenterY: number = 0

    get processingValue(): string {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getProcessingValue']
    }

    get valcoderStep(): number {
        // return this.$store.getters['ourExtension/layoutsData/moveWindow/getCurrentStep'];
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getValcoderStep']
    }

    get inputWindowData(): InputWindowData {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getInputWindowData']
    }

    get isItTime(): boolean {
        return Boolean(this.inputWindowData.isItTime)
    }

    setBlur(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        if (e.target) {
            const target = e.target as HTMLElement
            target.blur();
            // let className = target.className
            // if (!className) {
            //     className = target.id
            // }

            // const alert: InfoAlertType = {
            //     message: e.type + ' ' + className
            // }
            // Alerts.showInfoAlert(alert)
        }


    }

    mounted() {
        let newValue;
        if (this.isItTime) {
            newValue = TimeProcessor.toTime(TimeProcessor.toSeconds(this.processingValue))
        } else {
            newValue = +this.processingValue + '';
        }
        this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue);
        // window.addEventListener('mouseup', () => {
        //     this.mousedownFlag = false
        // })
    }

    finalLengthCheck(newValue: string): string {
        const maxValue = this.inputWindowData.maxValue;
        const minValue = this.inputWindowData.minValue;
        if (typeof maxValue === 'number' && +newValue > maxValue) {
            newValue = maxValue + '';
        }

        if (typeof minValue === 'number' && +newValue < minValue) {
            newValue = minValue + '';
        }

        return newValue;
    }

    cancelButtonClick() {
        this.$store.commit('ourExtension/layoutsData/inputWindow/reset');
        this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow');
    }

    confirmButtonClick() {
        this.$store.dispatch('ourExtension/layoutsData/inputWindow/confirm')
    }

    mouseMoveHandler(e: MouseEvent) {
        this.setBlur(e)
        if (this.mousedownFlag) {
            const [clickX, clickY, pointX, pointY, valcoderDiameter] = this.resolveClickCoord(e);
            if (clickX === null || clickY === null || pointX === null || pointY === null || valcoderDiameter === null) {
                return;
            }
            this.startValcoderProcess(clickX, clickY, pointX, pointY, valcoderDiameter);
        }
    }

    resolveClickCoord(e: MouseEvent) {
        const valcoderElement = this.$refs.valcoder as HTMLBaseElement;
        const targetElement = e.target as HTMLBaseElement;

        if (!valcoderElement || !targetElement) {
            return [null, null, null, null, null]
        }


        let clickX;
        let clickY;
        let valcoderDiameter = valcoderElement.offsetWidth;
        let pointRadius = (valcoderDiameter * 13 / 100) / 2;
        let pointX = valcoderDiameter * 8 / 100 - Math.round(valcoderDiameter / 2) + pointRadius;
        let pointY = Math.round(valcoderDiameter / 2) - valcoderDiameter * 60 / 100 - pointRadius;

        if (targetElement.id === "valcoder-point") {
            let tempX = e.offsetX;
            let tempY = e.offsetY;
            if (tempX > pointRadius) {
                clickX = pointX + (tempX - pointRadius)
            } else {
                clickX = pointX - (pointRadius - tempX)
            }

            if (tempY > pointRadius) {
                clickY = pointY - (tempY - pointRadius)
            } else {
                clickY = pointY + (pointRadius - tempY)
            }
        } else {
            clickX = e.offsetX - Math.round(valcoderDiameter / 2);
            clickY = Math.round(valcoderDiameter / 2) - e.offsetY;
        }

        return [clickX, clickY, pointX, pointY, valcoderDiameter];
    }

    touchHandler(e: TouchEvent) {
        const [touchX, touchY, pointX, pointY, valcoderDiameter] = this.resolveTouchCoord(e);
        if (touchX === null || touchY === null || pointX === null || pointY === null || valcoderDiameter === null) {
            return;
        }
        this.startValcoderProcess(touchX, touchY, pointX, pointY, valcoderDiameter);
    }

    resolveTouchCoord(e: TouchEvent): Array<number | null> {
        // параметры большого кружочка:
        const valcoderElement = this.$refs.valcoder as HTMLBaseElement;
        const valcoderCircleHolder = this.$refs.valcoderCircleHolder as HTMLBaseElement;

        if (!valcoderElement || !valcoderCircleHolder) {
            return [null, null, null, null, null]
        }
        let valcoderDiameter = valcoderElement.offsetWidth;
        // параметры маленького кружочка:
        let pointRadius = (valcoderDiameter * 13 / 100) / 2;
        let pointX = valcoderDiameter * 8 / 100 - Math.round(valcoderDiameter / 2) + pointRadius;
        let pointY = Math.round(valcoderDiameter / 2) - valcoderDiameter * 60 / 100 - pointRadius;
        // параметры клика (слайда):
        let absoluteTouchX = e.touches[0].clientX;
        let absoluteTouchY = e.touches[0].clientY;
        // относительно дефолтных осей координат:
        let valcoderAbsoluteCenterX = valcoderCircleHolder.getBoundingClientRect().x + valcoderCircleHolder.offsetWidth / 2
        let valcoderAbsoluteCenterY = valcoderCircleHolder.getBoundingClientRect().y + valcoderCircleHolder.offsetHeight / 2
        let defaultTouchX = absoluteTouchX - valcoderAbsoluteCenterX;
        let defaultTouchY = valcoderAbsoluteCenterY - absoluteTouchY;
        // с учетом поворота:
        let touchX = defaultTouchX * Math.cos(-this.angle * Math.PI / 180) + defaultTouchY * Math.sin(-this.angle * Math.PI / 180)
        let touchY = defaultTouchY * Math.cos(-this.angle * Math.PI / 180) - defaultTouchX * Math.sin(-this.angle * Math.PI / 180)
        return [touchX, touchY, pointX, pointY, valcoderDiameter];
    }

    startValcoderProcess(clickX: number, clickY: number, pointX: number, pointY: number, valcoderDiameter: number) {
        const valcoderElement = this.$refs.valcoder as HTMLBaseElement;
        if (!valcoderElement) {
            return;
        }

        let degDiff = this.getAngleDiff(0, 0, pointX, pointY, clickX, clickY);
        if (isNaN(degDiff)) {
            return;
        }

        if (this.isClockwiseDirection(clickX, clickY, pointX, pointY, valcoderDiameter)) {
            this.angle += degDiff;
        } else {
            this.angle -= degDiff;
        }

        this.refreshAngle();
        valcoderElement.style.transform = `rotate(${this.angle}deg)`;
        this.resolveValueUpdate();
    }

    getAngleDiff(aX: number, aY: number, bX: number, bY: number, cX: number, cY: number): number {  // a - вершина, угол которой надо найти
        let bLength = this.getLength(bX, aX, bY, aY);
        let cLength = this.getLength(cX, aX, cY, aY);
        let aLength = this.getLength(cX, bX, cY, bY);
        let radDiff = Math.acos((Math.pow(bLength, 2) + Math.pow(cLength, 2) - Math.pow(aLength, 2)) / (2 * bLength * cLength));
        return radDiff * 180 / Math.PI;
    }

    getLength(x2: number, x1: number, y2: number, y1: number) {
        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    }

    isClockwiseDirection(clickX: number, clickY: number, pointX: number, pointY: number, diameter: number) {
        let square = this.resolveSquare(clickX, clickY);
        if (square != 3) {
            return this.resolveBySquare(square)
        }
        let dimX = - (diameter / 2);
        let dimY = 0;
        let pointDegDiff = this.getAngleDiff(0, 0, pointX, pointY, dimX, dimY);
        let clickDegDiff = this.getAngleDiff(0, 0, clickX, clickY, dimX, dimY);
        if (pointDegDiff < clickDegDiff) {
            return false;
        }
        return true;
    }

    resolveBySquare(square: number) {
        switch (square) {
            case 2:
                return true;
            case 1:
                return true;
            case 4:
                return false;
            default:
                break;
        }
    }


    resolveSquare(xCoord: number, yCoord: number) {
        if (xCoord > 0) {
            if (yCoord > 0) {
                return 1;
            } else {
                return 4;
            }
        } else {
            if (yCoord > 0) {
                return 2;
            } else {
                return 3;
            }
        }
    }

    resolveValueUpdate() {
        let angleSteps = Math.round((this.angle - this.lastBorderAngle) / 30);
        if (angleSteps != 0) {
            if (this.isItTime) {
                const processingSeconds = TimeProcessor.toSeconds(this.processingValue)
                let newSeconds = this.round(processingSeconds + this.valcoderStep * angleSteps);
                if (newSeconds < 0) {
                    newSeconds = 0
                }
                let newTime = TimeProcessor.toTime(newSeconds)
                newTime = TimeProcessor.makeSatisfiesLength(newTime, this.inputWindowData.maxValue, this.inputWindowData.minValue)
                this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newTime)
                this.lastBorderAngle = this.angle;
            } else {
                let newValue = this.round(+this.processingValue + this.valcoderStep * angleSteps) + '';
                newValue = this.finalLengthCheck(newValue)
                this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
                this.lastBorderAngle = this.angle;
            }
        }
    }

    refreshAngle() {
        if (this.angle > 360) {
            this.angle -= 360;
            this.lastBorderAngle -= 360;
        }
        if (this.angle < -360) {
            this.angle += 360;
            this.lastBorderAngle += 360;
        }
    }

    round(value: number) {
        return Math.round(+value * 10) / 10;
    }
}
</script>