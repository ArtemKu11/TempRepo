export class DoubleRangeProcessor {
    holderUpperY: number | null = null
    holderDownY: number | null = null
    holderHeight: number | null = null
    rangeUpperY: number | null = null
    rangeDownY: number | null = null
    rangeHeight: number | null = null
    requiredY: number | null = null
    range: HTMLElement | null = null
    rangeHolder: HTMLElement | null = null
    processingPoint: string | null = null  // up / down

    startProcessing(range: HTMLElement, rangeHolder: HTMLElement, requiredY: number) {
        this.setNull()
        this.range = range;
        this.rangeHolder = rangeHolder;
        this.requiredY = requiredY;

        this.setRangeParams();
        this.setHolderParams();

        if (this.processingPoint === null) {
            this.resolveProcessingPoint()
        }

        let [topPercent, bottomPercent] = [this.getTopPercent(), this.getBottomPercent()]

        if (this.borderCheck()) {
            const diff = this.getDiffBetweenHolderAndClick()
            if (this.crashCheck(diff)) {
                if (this.processingPoint) {
                    if (this.processingPoint === 'up') {
                        topPercent = diff
                        // this.setUpperPersent(diff)
                    } else {
                        bottomPercent = diff
                        // this.setDownPersent(diff)
                    }
                }
            }
        }


        // return [this.getTopPercent(), this.getBottomPercent()]
        return [topPercent, bottomPercent]

    }

    crashCheck(diff: number): boolean {
        const numTop = this.getTopPercent()
        const numBottom = this.getBottomPercent()

        if (this.processingPoint === 'up') {
            return diff + numBottom < 95
        } else {
            return numTop + diff < 95
        }
    }

    getTopPercent(): number {
        let top = this.range?.style.top
        if (!top) {
            top = '0%'
        }
        top = top.slice(0, top.length - 1)
        return +top
    }

    getBottomPercent(): number {
        let bottom = this.range?.style.bottom
        if (!bottom) {
            bottom = '0%'
        }
        bottom = bottom.slice(0, bottom.length - 1)
        return +bottom
    }

    getDiffBetweenHolderAndClick(): number {
        if (this.requiredY && this.processingPoint && this.holderHeight && this.holderUpperY && this.holderDownY) {
            if (this.processingPoint === 'up') {
                return Math.abs((this.requiredY - this.holderUpperY) * 100 / this.holderHeight)
            } else {
                return Math.abs(100 - ((this.requiredY - this.holderUpperY) * 100 / this.holderHeight))
            }
        }
        return 0
    }

    borderCheck(): boolean {
        if (this.requiredY !== null && this.holderDownY !== null && this.holderUpperY !== null && this.processingPoint !== null) {
            if (this.processingPoint === 'up') {
                if (this.requiredY < this.holderUpperY) {
                    this.setUpperPersent(0)
                    return false
                } else {
                    return true
                }
            } else {
                if (this.requiredY > this.holderDownY) {
                    this.setDownPersent(0)
                    return false
                } else {
                    return true
                }
            }
        }
        return false
    }

    setUpperPersent(persent: number) {
        if (this.range) {
            this.range.style.top = `${persent}%`
        }
    }

    setDownPersent(persent: number) {
        if (this.range) {
            this.range.style.bottom = `${persent}%`
        }
    }


    resolveProcessingPoint() {
        if (this.rangeUpperY && this.requiredY && this.rangeDownY) {
            const upperDiff = Math.abs(this.rangeUpperY - this.requiredY)
            const downDiff = Math.abs(this.rangeDownY - this.requiredY)
            if (upperDiff === downDiff) {
                if (this.requiredY < this.rangeUpperY) {
                    this.processingPoint = 'up'
                } else {
                    this.processingPoint = 'down'
                }
            } else if (upperDiff < downDiff) {
                this.processingPoint = 'up'
            } else {
                this.processingPoint = 'down'
            }
        }
    }

    setHolderParams() {
        if (this.rangeHolder) {
            let [uY, dY, h] = this.getAllParams(this.rangeHolder)
            this.holderUpperY = uY
            this.holderDownY = dY
            this.holderHeight = h
        }
    }

    setRangeParams() {
        if (this.range) {
            let [uY, dY, h] = this.getAllParams(this.range)
            this.rangeUpperY = uY
            this.rangeDownY = dY
            this.rangeHeight = h
        }
    }

    setNull() {
        this.holderUpperY = null
        this.holderDownY = null
        this.holderHeight = null
        this.rangeUpperY = null
        this.rangeDownY = null
        this.rangeHeight = null
        this.requiredY = null
    }

    getAllParams(element: HTMLElement): number[] {
        return [this.getUpperY(element), this.getDownY(element), this.getHeight(element)]
    }

    getUpperY(element: HTMLElement): number {
        return element.getBoundingClientRect().y
    }

    getDownY(element: HTMLElement): number {
        const height = element.getBoundingClientRect().height
        return this.getUpperY(element) + height
    }

    getHeight(element: HTMLElement): number {
        return element.getBoundingClientRect().height
    }
}


export const doubleRangeProcessor = new DoubleRangeProcessor();