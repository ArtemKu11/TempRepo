<template>
    <div @mouseup="mousedownFlag = false" id="valcoder-input-resources">
        <div id="valcoder">
            <img src="@/layouts/move_layout/img/valcoder_strelka.png" />
            <div id="plus-minus-holder">
                <span>+</span>
                <span>-</span>
            </div>
            <div id="valcoder-circle-holder">
                <div ref="valcoder" @touchmove="tempMethod" @mouseup="mousedownFlag = false"
                    @mousedown="mousedownFlag = true" @mousemove="rotateValcoder" @click="clickHandler"
                    id="valcoder-circle">
                    <div ref="valcoderPoint" id="valcoder-point"></div>
                </div>
            </div>
        </div>
        <div id="confirm-buttons">
            <button @click="this.$emit('cancelEvent')"><img
                    src="@/layouts/move_layout/img/cancel_button.png"><span>Отменить</span></button>
            <button @click="this.$emit('closeEvent')"><img
                    src="@/layouts/move_layout/img/save_button.png"><span>Сохранить</span></button>
        </div>
    </div>
</template>

<script>
export default {
    name: "ValcoderInput",
    props: ['modelValue', 'step'],
    emits: ['update:modelValue', 'closeEvent'],
    data() {
        return {
            mousedownFlag: false,
            lastCoords: {
                xCoord: 0,
                yCoord: 0,
            },
            angle: 0,
            lastBorderAngle: 0,
        }
    },

    mounted() {
        this.$emit('update:modelValue', +this.modelValue)
    },
    methods: {
        tempMethod(e) {
            let valcoderDiameter = this.$refs.valcoder.offsetWidth;
            let pointRadius = (valcoderDiameter * 13 / 100) / 2;
            let pointX = valcoderDiameter * 8 / 100 - Math.round(valcoderDiameter / 2) + pointRadius;
            let pointY = Math.round(valcoderDiameter / 2) - valcoderDiameter * 60 / 100 - pointRadius;
            let absoluteX = e.touches[0].clientX;
            let absoluteY = e.touches[0].clientY;
            let valcoderAbsoluteX = this.$refs.valcoder.getBoundingClientRect().x;
            let valcoderAbsoluteY = this.$refs.valcoder.getBoundingClientRect().y;
            let offsetX = absoluteX - valcoderAbsoluteX;
            let offsetY = absoluteY - valcoderAbsoluteY;
            console.log(e.touches[0], this.$refs.valcoder.getBoundingClientRect().x)

            let clickX = offsetX - Math.round(valcoderDiameter / 2);
            let clickY = Math.round(valcoderDiameter / 2) - offsetY;
            // console.log(clickX, clickY,  pointX, pointY)
            this.startValcoderProcess(clickX, clickY, pointX, pointY, valcoderDiameter);

        },

        rotateValcoder(e) {
            if (this.mousedownFlag) {

                let [clickX, clickY, pointX, pointY, valcoderDiameter] = this.resolveClickCoord(e);
                this.startValcoderProcess(clickX, clickY, pointX, pointY, valcoderDiameter);
            }

        },

        startValcoderProcess(clickX, clickY, pointX, pointY, valcoderDiameter) {
            let degDiff = this.getAngleDiff(0, 0, pointX, pointY, clickX, clickY);
            if (isNaN(degDiff)) {
                return;
            }

            if (this.isClockwiseDirection(clickX, clickY, pointX, pointY, valcoderDiameter)) {
                this.angle += degDiff;
            } else {
                this.angle -= degDiff;
            }

            this.refreshAngle;
            this.$refs.valcoder.style.transform = `rotate(${this.angle}deg)`;
            this.resolveValueUpdate();
        },

        resolveClickCoord(e) {
            let clickX;
            let clickY;
            let valcoderDiameter = this.$refs.valcoder.offsetWidth;
            let pointRadius = (valcoderDiameter * 13 / 100) / 2;
            let pointX = valcoderDiameter * 8 / 100 - Math.round(valcoderDiameter / 2) + pointRadius;
            let pointY = Math.round(valcoderDiameter / 2) - valcoderDiameter * 60 / 100 - pointRadius;

            if (e.target.id === "valcoder-point") {
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
        },

        resolveValueUpdate() {
            let angleSteps = Math.round((this.angle - this.lastBorderAngle) / 30);
            if (angleSteps != 0) {
                this.$emit('update:modelValue', this.round(this.modelValue + this.step * angleSteps))
                this.lastBorderAngle = this.angle;
            }
        },

        refreshAngle() {
            if (this.angle > 360) {
                this.angle -= 360;
            }
            if (this.angle < -360) {
                this.angle += 360;
            }
        },

        isClockwiseDirection(clickX, clickY, pointX, pointY, diameter) {
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
        },

        resolveBySquare(square) {
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
        },

        getAngleDiff(aX, aY, bX, bY, cX, cY) {  // a - вершина, угол которой надо найти
            let bLength = this.getLength(bX, aX, bY, aY);
            let cLength = this.getLength(cX, aX, cY, aY);
            let aLength = this.getLength(cX, bX, cY, bY);
            let radDiff = Math.acos((Math.pow(bLength, 2) + Math.pow(cLength, 2) - Math.pow(aLength, 2)) / (2 * bLength * cLength));
            return radDiff * 180 / Math.PI;
        },

        getLength(x2, x1, y2, y1) {
            return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        },


        resolveSquare(xCoord, yCoord) {
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
        },

        mousedownEvent(e) {
            let diameter = this.$refs.valocder.offsetWidth;
            this.lastCoords.xCoord = e.offsetX - Math.round(diameter / 2);
            this.lastCoords.yCoord = Math.round(diameter / 2) - e.offsetY;
            this.angle = 0;
        },

        round(value) {
            return Math.round(+value * 10) / 10;
        }

    }
}
</script>