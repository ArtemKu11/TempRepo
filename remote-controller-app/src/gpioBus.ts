import Vue from 'vue'

export const GpioBus = {
    bus: new Vue(),
    $emit: (event: GpioEvent): void => {
        GpioBus.bus.$emit('gpioEvent', event)
    }
}

export interface GpioEvent {
    buttonNumber: number,
    type: string
}