import { InputWindowData } from "@/store/ourExtension/layoutsData/inputWindow/types"
import { TimeProcessor } from "./timeProcessor"

export interface ReturnedValcoderData {
    newValue: string | null
    degDiff: number
    touchX: number
    touchY: number
}

export class ValcoderProcessor {
    private angle: number = 0
    private lastBorderAngle: number = 0
    private isItTime: boolean
    private processingValue: string | null = null
    private valcoderStep: number | null = null
    private inputWindowData: InputWindowData | null = null
    private VALCODER_ANGLE = 15

    constructor(isItTime: boolean) {
        this.isItTime = isItTime
    }

    mouseMoveProcessing(e: MouseEvent, valcoderElement: HTMLBaseElement | undefined,
        targetElement: HTMLBaseElement | undefined, processingValue: string,
        valcoderStep: number, inputWindowData: InputWindowData): string | null {
        if (!valcoderElement || !targetElement) {
            return null;
        }
        this.setNull()
        this.processingValue = processingValue
        this.valcoderStep = valcoderStep
        this.inputWindowData = inputWindowData
        const [clickX, clickY, pointX, pointY, valcoderDiameter] = this.resolveClickCoord(e, valcoderElement, targetElement);
        return this.startValcoderProcess(clickX, clickY, pointX, pointY, valcoderDiameter, valcoderElement);
    }

    touchMoveProcessing(e: TouchEvent, valcoderElement: HTMLBaseElement | undefined,
        valcoderCircleHolder: HTMLBaseElement | undefined, processingValue: string,
        valcoderStep: number, inputWindowData: InputWindowData): ReturnedValcoderData | null {
        if (!valcoderElement || !valcoderCircleHolder) {
            return null;
        }
        this.setNull()
        this.processingValue = processingValue
        this.valcoderStep = valcoderStep
        this.inputWindowData = inputWindowData
        const [touchX, touchY, pointX, pointY, valcoderDiameter, defaultTouchX, defaultTouchY] = this.resolveTouchCoord(e, valcoderElement, valcoderCircleHolder);
        if (this.isCenterOfValcoderTouched(valcoderDiameter, defaultTouchX, defaultTouchY)) {
            return null
        }
        const newValue = this.startValcoderProcess(touchX, touchY, pointX, pointY, valcoderDiameter, valcoderElement);
        let angleDiff = this.getAngleDiff(0, 0, pointX, pointY, touchX, touchY);
        if (!this.isClockwiseDirection(touchX, touchY, pointX, pointY, valcoderDiameter)) {
            angleDiff = -angleDiff
        }
        if (isNaN(angleDiff)) {
            return null
        }
        return {
            newValue: newValue,
            degDiff: angleDiff,
            touchX: defaultTouchX,
            touchY: defaultTouchY
        }
    }

    private isCenterOfValcoderTouched(valcoderDiameter: number, defaultTouchX: number, defaultTouchY: number): boolean {
        const forbiddenZone = valcoderDiameter / 5
        const touchRadius = Math.sqrt(Math.pow(defaultTouchX, 2) + Math.pow(defaultTouchY, 2))
        return touchRadius < forbiddenZone
    }

    private resolveTouchCoord(e: TouchEvent, valcoderElement: HTMLBaseElement, valcoderCircleHolder: HTMLBaseElement): number[] {
        // параметры большого кружочка:
        let valcoderDiameter = valcoderElement.offsetWidth;
        // параметры маленького кружочка:
        let pointRadius = (valcoderDiameter * 13 / 100) / 2;
        let pointX = valcoderDiameter * 8 / 100 - Math.round(valcoderDiameter / 2) + pointRadius;
        let pointY = Math.round(valcoderDiameter / 2) - valcoderDiameter * 60 / 100 - pointRadius;
        // параметры клика (слайда):
        let absoluteTouchX, absoluteTouchY;
        if (e.type === 'touchend') {
            absoluteTouchX = e.changedTouches[0].clientX;
            absoluteTouchY = e.changedTouches[0].clientY;
        } else {
            absoluteTouchX = e.touches[0].clientX;
            absoluteTouchY = e.touches[0].clientY;
        }
        // относительно дефолтных осей координат:
        let valcoderAbsoluteCenterX = valcoderCircleHolder.getBoundingClientRect().x + valcoderCircleHolder.offsetWidth / 2
        let valcoderAbsoluteCenterY = valcoderCircleHolder.getBoundingClientRect().y + valcoderCircleHolder.offsetHeight / 2
        let defaultTouchX = absoluteTouchX - valcoderAbsoluteCenterX;
        let defaultTouchY = valcoderAbsoluteCenterY - absoluteTouchY;
        // с учетом поворота:
        let touchX = defaultTouchX * Math.cos(-this.angle * Math.PI / 180) + defaultTouchY * Math.sin(-this.angle * Math.PI / 180)
        let touchY = defaultTouchY * Math.cos(-this.angle * Math.PI / 180) - defaultTouchX * Math.sin(-this.angle * Math.PI / 180)
        return [touchX, touchY, pointX, pointY, valcoderDiameter, defaultTouchX, defaultTouchY];
    }

    private setNull() {
        this.processingValue = null
        this.valcoderStep = null
        this.inputWindowData = null
    }

    private resolveClickCoord(e: MouseEvent, valcoderElement: HTMLBaseElement, targetElement: HTMLBaseElement) {
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

    private startValcoderProcess(clickX: number, clickY: number, pointX: number, pointY: number, valcoderDiameter: number,
        valcoderElement: HTMLBaseElement): string | null {
        if (!valcoderElement) {
            return null;
        }

        let degDiff = this.getAngleDiff(0, 0, pointX, pointY, clickX, clickY);
        if (isNaN(degDiff)) {
            return null;
        }

        if (this.isClockwiseDirection(clickX, clickY, pointX, pointY, valcoderDiameter)) {
            this.angle += degDiff;
        } else {
            this.angle -= degDiff;
        }

        this.refreshAngle();
        valcoderElement.style.transform = `rotate(${this.angle}deg)`;
        return this.resolveNewValue()
    }

    private getAngleDiff(aX: number, aY: number, bX: number, bY: number, cX: number, cY: number): number {  // a - вершина, угол которой надо найти
        let bLength = this.getLength(bX, aX, bY, aY);
        let cLength = this.getLength(cX, aX, cY, aY);
        let aLength = this.getLength(cX, bX, cY, bY);
        let radDiff = Math.acos((Math.pow(bLength, 2) + Math.pow(cLength, 2) - Math.pow(aLength, 2)) / (2 * bLength * cLength));
        return radDiff * 180 / Math.PI;
    }

    private getLength(x2: number, x1: number, y2: number, y1: number) {
        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    }

    private isClockwiseDirection(clickX: number, clickY: number, pointX: number, pointY: number, diameter: number) {
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

    private resolveBySquare(square: number) {
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


    private resolveSquare(xCoord: number, yCoord: number) {
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

    private resolveNewValue(): string | null {
        let angleSteps = Math.trunc((this.angle - this.lastBorderAngle) / this.VALCODER_ANGLE);
        if (this.processingValue === null || this.valcoderStep === null || this.inputWindowData === null) {
            return null;
        }
        if (angleSteps != 0) {
            if (this.isItTime) {
                const processingSeconds = TimeProcessor.toSeconds(this.processingValue)
                let newSeconds = this.round(processingSeconds + this.valcoderStep * angleSteps);
                if (newSeconds < 0) {
                    newSeconds = 0
                }
                let newTime = TimeProcessor.toTime(newSeconds)
                newTime = TimeProcessor.makeSatisfiesLength(newTime, this.inputWindowData.maxValue, this.inputWindowData.minValue)
                // this.lastBorderAngle = this.angle;
                this.lastBorderAngle += this.VALCODER_ANGLE * angleSteps
                return newTime
            } else {
                let newValue = this.round(+this.processingValue + this.valcoderStep * angleSteps) + '';
                newValue = this.finalLengthCheck(newValue)
                // this.lastBorderAngle = this.angle;
                this.lastBorderAngle += this.VALCODER_ANGLE * angleSteps
                return newValue
            }
        }
        return null
    }

    private refreshAngle() {
        if (this.angle > 360) {
            this.angle -= 360;
            this.lastBorderAngle -= 360;
        }
        if (this.angle < -360) {
            this.angle += 360;
            this.lastBorderAngle += 360;
        }
    }

    private round(value: number) {
        return Math.round(+value * 10) / 10;
    }

    private finalLengthCheck(newValue: string): string {
        const maxValue = this.inputWindowData!.maxValue;
        const minValue = this.inputWindowData!.minValue;
        if (typeof maxValue === 'number' && +newValue > maxValue) {
            newValue = maxValue + '';
        }

        if (typeof minValue === 'number' && +newValue < minValue) {
            newValue = minValue + '';
        }

        return newValue;
    }

    async keyboardEventProcessing(isClockwiseDirection: boolean, valcoderElement: HTMLBaseElement | undefined,
        processingValue: string, valcoderStep: number, inputWindowData: InputWindowData): Promise<string | null> {
        if (!valcoderElement) {
            return null;
        }
        this.setNull()
        this.processingValue = processingValue
        this.valcoderStep = valcoderStep
        this.inputWindowData = inputWindowData


        if (isClockwiseDirection) {
            this.angle = this.lastBorderAngle + this.VALCODER_ANGLE
        } else {
            this.angle = this.lastBorderAngle - this.VALCODER_ANGLE
        }


        this.refreshAngle()
        // valcoderElement.style.transform = `rotate(${this.angle}deg)`;
        await this.animateRotation(isClockwiseDirection, this.angle, this.lastBorderAngle, valcoderElement)
        return this.resolveNewValue()
    }

    async animateRotation(isClockwiseDirection: boolean, targetAngle: number, currentAngle: number, valcoderElement: HTMLBaseElement) {
        if (isClockwiseDirection) {
            currentAngle += 2
            if (currentAngle > targetAngle) {
                valcoderElement.style.transform = `rotate(${targetAngle}deg)`;
                return
            }
        } else {
            currentAngle -= 2
            if (currentAngle < targetAngle) {
                valcoderElement.style.transform = `rotate(${targetAngle}deg)`;
                return
            }
        }

        valcoderElement.style.transform = `rotate(${currentAngle}deg)`;
        setTimeout(this.animateRotation.bind(this, isClockwiseDirection, targetAngle, currentAngle, valcoderElement), 1)

    }
}