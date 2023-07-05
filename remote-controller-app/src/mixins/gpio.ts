import { EncoderState } from '@/store/ourExtension/gpio/types'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class GpioMixin extends Vue {
    buttonsInterrups = {  // Если true - эта кнопка не будет вызвать resolveClick(). Только поменяет класс css. Нужно для разрешения конфликта сенсор - gpio. Сенсор в приоритете
        firstButton: false,
        secondButton: false,
        thirdButton: false,
        fourthButton: false,
        fifthButton: false,
        sixthButton: false
    }

    get gpioSocketConnected() {
        return this.$store.getters['ourExtension/gpio/getSocketConnected']
    }

    get isFirstButtonPressed(): boolean {
        return this.$store.getters['ourExtension/gpio/getFirstButton']
    }

    set isFirstButtonPressed(newValue: boolean) {
        this.$store.commit('ourExtension/gpio/setFirstButton', newValue)
    }

    get isSecondButtonPressed(): boolean {
        return this.$store.getters['ourExtension/gpio/getSecondButton']
    }

    set isSecondButtonPressed(newValue: boolean) {
        this.$store.commit('ourExtension/gpio/setSecondButton', newValue)
    }

    get isThirdButtonPressed(): boolean {
        return this.$store.getters['ourExtension/gpio/getThirdButton']
    }

    set isThirdButtonPressed(newValue: boolean) {
        this.$store.commit('ourExtension/gpio/setThirdButton', newValue)
    }

    get isFourthButtonPressed(): boolean {
        return this.$store.getters['ourExtension/gpio/getFourthButton']
    }

    set isFourthButtonPressed(newValue: boolean) {
        this.$store.commit('ourExtension/gpio/setFourthButton', newValue)
    }

    get isFifthButtonPressed(): boolean {
        return this.$store.getters['ourExtension/gpio/getFifthButton']
    }

    set isFifthButtonPressed(newValue: boolean) {
        this.$store.commit('ourExtension/gpio/setFifthButton', newValue)
    }

    get isSixthButtonPressed(): boolean {
        return this.$store.getters['ourExtension/gpio/getSixthButton']
    }

    set isSixthButtonPressed(newValue: boolean) {
        this.$store.commit('ourExtension/gpio/setSixthButton', newValue)
    }

    setAllButtonsPressed(newValue: boolean) {
        this.setAllButtonsInterrups(true)
        this.isFirstButtonPressed = newValue
        this.isSecondButtonPressed = newValue
        this.isThirdButtonPressed = newValue
        this.isFourthButtonPressed = newValue
        this.isFifthButtonPressed = newValue
        this.isSixthButtonPressed = newValue
        setTimeout(() => {this.setAllButtonsInterrups(false)}, 100)
    }

    setAllButtonsInterrups(newValue: boolean) {
        const interrups = this.buttonsInterrups as any
        for (const button in interrups) {
            interrups[button] = newValue
        }
    }

    get encoder1State(): EncoderState {
        return this.$store.getters['ourExtension/gpio/getEncoder1']
    }
}