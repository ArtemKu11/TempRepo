<template>
    <div class="content-container printing-window">
        <PrintSettings v-if="printSettingsFLag" />

        <div id="content-header">
            <div class="operation-and-warnings-container">
                <div class="operation-container">{{ localPrinterState }}...</div>
                <span v-if="warningFlag">WARNING</span>
                <span v-if="noGasFlag">NO GAS</span>
            </div>
            <div class="coordinates-container">
                <img src="@/layouts/print_layout/img/gorelka_logo.svg" />
                <span id="x-coords">{{ coordinatesHolder[0] }}</span>
                <span id="y-coords">{{ coordinatesHolder[1] }}</span>
                <span id="z-coords">{{ coordinatesHolder[2] }}</span>
            </div>
        </div>
        <div id="content-center">
            <div id="rejim">
                <span>Параметры режима: </span>
                <span>{{ printingDiapason.profile.name }}</span>
            </div>
            <div id="kostyl">
                <div id="parameters-and-tetka">
                    <div id="parameters-holder">

                        <div class="usual-holder">
                            <div class="tree-buttons-holder">
                                <button @click="parameterClickHandler('Ток, А', 'current', 1)" class="parameter-button">
                                    <span>{{ current }}</span>
                                    <div class="underline"></div>
                                    <span>Ток, А</span>
                                </button>
                                <button @click="parameterClickHandler('Напряжение, В', 'voltage', 1)"
                                    class="parameter-button">
                                    <span>{{ voltage }}</span>
                                    <div class="underline"></div>
                                    <span>Напряжение, В</span>
                                </button>
                                <button @click="parameterClickHandler('V подачи, м/мин', 'feedRate', 0.1)"
                                    class="parameter-button">
                                    <span>{{ feedRate }}</span>
                                    <div class="underline"></div>
                                    <span>V подачи, м/мин</span>
                                </button>
                            </div>
                        </div>

                        <div class="usual-holder">
                            <span>Параметры печати:</span>
                            <div class="tree-buttons-holder">
                                <button @click="listClickHandler('oscillationType')" class="parameter-button">
                                    <div class="img-wrapper">
                                        <img src="@/layouts/print_layout/img/oscilation_logo.png" width="105" height="1">
                                    </div>
                                    <span>Тип: {{ oscillationType }}</span>
                                </button>
                                <button @click="parameterClickHandler('V подачи, м/мин', 'weldingSpeed', 0.1)"
                                    class="parameter-button">
                                    <span>{{ weldingSpeed }}</span>
                                    <span>V печати, м/мин</span>
                                </button>
                                <button @click="parameterClickHandler('Сдвиг Z, мм', 'shift', 0.1)"
                                    class="parameter-button">
                                    <span>{{ shift }}</span>
                                    <span>Сдвиг Z, мм</span>
                                </button>
                            </div>
                        </div>

                    </div>
                    <img src="@/layouts/print_layout/img/tetka.svg">
                </div>
                <div id="progress-bar">
                    <div id="buttons-wrapper">
                        <span>{{ localPrinterState }}...</span>
                        <div>
                            <button @click="clickHandler('resume')" :class="{ 'active': resume }"><img id="resume"
                                    src="@/layouts/print_layout/img/resume.svg"></button>
                            <button @click="clickHandler('pause')" :class="{ 'active': pause }"><img id="pause"
                                    src="@/layouts/print_layout/img/pause.svg"></button>
                            <button @click="openPrintSettings"><img id="points"
                                    src="@/layouts/print_layout/img/points.svg"></button>
                        </div>
                    </div>
                    <div id="progress-bar-wrapper">
                        <span>{{ fileName }}</span>
                        <div id="progress-bar-impl">
                            <div ref="progressBar"></div>
                        </div>
                        <div id="progress-status">
                            <div>
                                <img src="@/layouts/print_layout/img/progress.svg">
                                <span>Прогресс: {{ printProgress }}%</span>
                            </div>

                            <div>
                                <img src="@/layouts/print_layout/img/layers.svg">
                                <span>Слои: {{ printLayer }}/{{ file.layers }}</span>
                            </div>

                            <div>
                                <img src="@/layouts/print_layout/img/height.svg">
                                <span>Высота, мм: 2000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>


<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import PrintSettings from './PrintSettings.vue';
import { PrintingDiapasonForMoonraker, ProfilesMetadata } from '@/store/ourExtension/profiles/types';
import WindowsMixin from '@/mixins/windows';
import { FileData } from '@/store/ourExtension/files/types';
import StateMixin from '@/mixins/state';
import { SocketActions } from '@/api/socketActions';

@Component({
    components: {
        PrintSettings
    },
})
export default class PrintingWindow extends Mixins(WindowsMixin, StateMixin) {
    warningFlag = false
    noGasFlag = false
    processingSetter: string = ''

    get resume(): boolean {
        return this.printerState.toLowerCase() === 'printing'
    }

    get pause(): boolean {
        return this.printerState.toLowerCase() === 'paused'
    }


    get printProgress(): number {
        const progress = this.$store.getters['printer/getPrintProgress']
        const progressBar = this.$refs.progressBar as HTMLElement
        if (progressBar) {
            progressBar.style.width = `${progress}%`
        }
        return progress
    }

    get printLayer(): number {
        return this.$store.getters['printer/getPrintLayer']
    }

    get localPrinterState(): string {
        switch (this.printerState.toLowerCase()) {
            case 'loading':
                return 'Загрузка'
            case 'printing':
                return 'Печатается'
            case 'paused':
                return 'Приостановлено'
            case 'busy':
                return 'Принтер занят'
            case 'cancelled':
                return 'Отменено'
            case 'ready':
                return 'Готов к печати'
            case 'idle':
                return 'Бездействует'
            default:
                break;
        }
        return this.printerState.toLowerCase()
    }

    get file(): FileData {
        return this.$store.getters['ourExtension/layoutsData/printingWindow/getFile']()
    }

    get fileName(): string {
        let name = this.file.name
        if (name.length > 30) {
            name = name.slice(0, 30) + '...'
        }
        return name
    }

    get printSettingsFLag() {
        return this.$store.getters['ourExtension/windowFlags/getPrintSettingsWindowFlag']
    }

    get printingDiapason(): PrintingDiapasonForMoonraker {
        return this.$store.getters['ourExtension/layoutsData/printingWindow/getPrintingDiapason']()
    }

    get current(): number {
        return this.printingDiapason.profile.profileMainParameters.current
    }

    set current(newValue: number) {
        this.printingDiapason.profile.profileMainParameters.current = newValue
    }

    get voltage(): number {
        return this.printingDiapason.profile.profileMainParameters.voltage
    }

    set voltage(newValue: number) {
        this.printingDiapason.profile.profileMainParameters.voltage = newValue
    }

    get feedRate(): number {
        return this.printingDiapason.profile.profileMainParameters.feedRate
    }

    set feedRate(newValue: number) {
        this.printingDiapason.profile.profileMainParameters.feedRate = newValue
    }

    get oscillationType(): string {
        return this.printingDiapason.profile.profileOscilationParameters.type
    }

    set oscillationType(newValue: string) {
        this.printingDiapason.profile.profileOscilationParameters.type = newValue
    }

    get weldingSpeed(): number {
        return this.printingDiapason.profile.profileAdditionalParameters.weldingSpeed
    }

    set weldingSpeed(newValue: number) {
        this.printingDiapason.profile.profileAdditionalParameters.weldingSpeed = newValue
    }

    get shift(): number {
        return this.$store.getters['ourExtension/layoutsData/printingWindow/getShift']
    }

    set shift(newValue: number) {
        this.$store.state.ourExtension.layoutsData.printingWindow.shift = newValue
    }

    get coordinatesHolder(): number[] {
        return this.$store.getters['ourExtension/layoutsData/moveWindow/getCoordinates']()
    }

    get profilesMetadata(): ProfilesMetadata {
        return this.$store.getters['ourExtension/profiles/getProfilesMetadata']
    }

    openPrintSettings() {
        this.$store.dispatch('ourExtension/windowFlags/openPrintSettingsWindow')
    }

    parameterClickHandler(parameterName: string, setter: string, valcoderStep: number) {
        let rejectPoint = true
        this.processingSetter = setter
        let initValue = 0
        if (setter in this) {
            const context = this as any
            initValue = context[setter]
        }
        const callback = this.newValueReceiver.bind(this)
        if (valcoderStep / valcoderStep !== 1) {
            rejectPoint = false
        }
        this.openInputWindow(false, parameterName, initValue, valcoderStep, 'void', callback, 2000, -2000, rejectPoint, '')
    }

    newValueReceiver(newValue: number) {
        if (this.processingSetter in this) {
            const context = this as any
            context[this.processingSetter] = newValue
        }
        this.processingSetter = ''
    }

    listClickHandler(setter: string) {
        let initList: string[] = []
        const callback = this.newStringValueReceiver.bind(this)
        if (setter === 'oscillationType') {
            initList = this.profilesMetadata.oscilationTypes
        }
        this.processingSetter = setter
        this.openSelectWindowWithoutIcon(callback, initList)
    }

    newStringValueReceiver(newValue: string) {
        if (this.processingSetter in this) {
            const context = this as any
            context[this.processingSetter] = newValue
        }
        this.processingSetter = ''
    }

    clickHandler(buttonName: string) {
        switch (buttonName) {
            case 'resume':
                if (this.printerState.toLowerCase() !== 'printing') {
                    this.resumePrint()
                }
                break;
            case 'pause':
                if (this.printerState.toLowerCase() !== 'paused') {
                    this.pausePrint()
                }
                break;
            default:
                break;
        }
    }

    pausePrint() {
        SocketActions.printerPrintPause()
        this.addConsoleEntry('PAUSE')
    }

    resumePrint() {
        SocketActions.printerPrintResume()
        this.addConsoleEntry('RESUME')
    }

    resetFile() {
        this.sendGcode('SDCARD_RESET_FILE')
    }
}
</script>


<style lang="scss">
@import '@/layouts/print_layout/css/print_layout.scss'
</style>