export const TimeProcessor = {
    toSeconds(timeValue: string): number {
        let [minutes, seconds] = timeValue.split(':');
        minutes = minutes.replace('-', '0')
        seconds = seconds.replace('-', '0')
        let numMinutes = +minutes;
        let numSeconds = + seconds;
        if (isNaN(numMinutes)) {
            numMinutes = 0
        }
        if (isNaN(numSeconds)) {
            numSeconds = 0
        }
        return numMinutes * 60 + numSeconds
    },

    toTime(seconds: number): string {
        let numMinutes = Math.floor(seconds / 60)
        let numSeconds = (seconds - (numMinutes * 60)) % 60
        let strMinutes = numMinutes + ''
        let strSeconds = numSeconds + ''
        if (strMinutes.length === 1) {
            strMinutes = '0' + strMinutes
        }

        if (strSeconds.length === 1) {
            strSeconds = '0' + strSeconds
        }

        return strMinutes + ':' + strSeconds
    },

    digitButton(timeValue: string, digit: string, maxValueInSec?: number, minValueInSec?: number) {
        const index = timeValue.indexOf('-')
        let newValue = timeValue;
        if (index !== -1) {
            newValue = this.replaceAt(timeValue, index, digit)
        }
        if (this.isSatisfiedLength(newValue, maxValueInSec, minValueInSec)) {
            if (newValue[0] !== '-' && +newValue[0] > 5) {
                newValue = this.replaceAt(newValue, 0, '5')
            }
            if (newValue[3] !== '-' && +newValue[3] > 5) {
                newValue = this.replaceAt(newValue, 3, '5')
            }
            return newValue
        } else {
            return this.makeSatisfiesLength(newValue, maxValueInSec, minValueInSec)
        }
    },

    isSatisfiedLength(timeValue: string, maxValueInSec?: number, minValueInSec?: number): boolean {
        const index = timeValue.indexOf('-')
        if (index !== -1) {
            return true
        }
        let seconds = this.toSeconds(timeValue)
        if (typeof maxValueInSec !== 'undefined') {
            if (seconds > maxValueInSec) {
                return false
            }
        }

        if (typeof minValueInSec !== 'undefined') {
            if (seconds < minValueInSec) {
                return false
            }
        }

        if (seconds < 0) {
            return false
        }

        if (seconds > 6039) {
            return false
        }

        const timeSeconds = +timeValue.split(':')[1]
        if (timeSeconds > 60) {
            return false
        }

        if (timeValue[0] !== '-' && +timeValue[0] > 5) {
            return false
        }

        return true
    },

    makeSatisfiesLength(timeValue: string, maxValueInSec?: number, minValueInSec?: number): string {
        const index = timeValue.indexOf('-')
        if (index !== -1) {
            return this.toTime(this.toSeconds(timeValue))
        }
        let seconds = this.toSeconds(timeValue)
        if (typeof maxValueInSec !== 'undefined') {
            if (seconds > maxValueInSec) {
                seconds = maxValueInSec
            }
        }

        if (typeof minValueInSec !== 'undefined') {
            if (seconds < minValueInSec) {
                seconds = minValueInSec
            }
        }

        if (seconds < 0) {
            seconds = 0
        }

        if (seconds > 5999) {
            seconds = 5999
        }

        let [timeMinutes, timeSeconds] = timeValue.split(':')
        if (+timeSeconds > 59) {
            seconds = +timeMinutes * 60 + 59
        }

        let newTime = this.toTime(seconds)

        if (newTime[0] !== '-' && +newTime[0] > 5) {
            newTime = this.replaceAt(newTime, 0, '5')
        }

        return newTime
    },

    replaceAt(str: string, index: number, replacement: string) {
        return str.substring(0, index) + replacement + str.substring(index + 1)
    },

    deleteButton(timeValue: string) {
        console.log('here')
        let index = timeValue.indexOf('-')
        if (index === -1) {
            timeValue = this.replaceAt(timeValue, timeValue.length - 1, '-')
            return timeValue
        }
        if (index !== 0) {
            if (timeValue[index - 1] === ':') {
                index = index - 1
            }
            timeValue = this.replaceAt(timeValue, index - 1, '-')
        }
        return timeValue
    },

    confirm(timeValue: string, maxValueInSec?: number, minValueInSec?: number) {
        let newValue = this.toSeconds(timeValue)
        if (typeof minValueInSec !== 'undefined' && typeof maxValueInSec !== 'undefined') {
            if (newValue < minValueInSec) {
                newValue = minValueInSec
            }
            if (newValue > maxValueInSec) {
                newValue = maxValueInSec
            }
        }
        return this.toTime(newValue)
    },

    isMaxAndMinCheck(maxValueInSec?: number, minValueInSec?: number): boolean {
        return (typeof maxValueInSec !== 'number' || isNaN(maxValueInSec) || typeof minValueInSec !== 'number' || isNaN(minValueInSec))
    }
}