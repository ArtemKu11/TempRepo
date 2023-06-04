import { InputWindowData } from "@/store/ourExtension/layoutsData/inputWindow/types";
import { RootState } from "@/store/types";
import { Store } from "vuex";

export class OnlineValcoderProcessor {
    readonly SENDING_TIMEOUT = 20;
    $store: Store<RootState>
    currentTimeout: number | null = null
    lastSendedValue: number


    constructor(store: Store<RootState>) {
        this.$store = store
        this.lastSendedValue = +this.processingValue
    }

    get processingValue(): string {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getProcessingValue']
    }

    get inputWindowData(): InputWindowData {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getInputWindowData']
    }

    get confirmCallback(): Function | undefined {
        return this.inputWindowData.callbackAfterConfirm
    }

    startProcessing() {
        this.tryToSendValue()
        this.currentTimeout = setTimeout(() => {
            this.startProcessing()
        }, this.SENDING_TIMEOUT)
    }

    stopProcessing() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout)
            this.currentTimeout = null
        }
        this.tryToSendValue()
    }

    tryToSendValue() {
        const sendedValue = +this.processingValue
        const distance = sendedValue - this.lastSendedValue
        if (distance) {
            this.lastSendedValue = sendedValue
            if (this.confirmCallback) {
                this.confirmCallback(distance)
            }
        }
    }
}