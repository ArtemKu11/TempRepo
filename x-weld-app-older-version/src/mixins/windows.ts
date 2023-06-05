import { FileData, GcodePrintingProfiles } from '@/store/ourExtension/files/types'
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers'
import { AlertType, InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types'
import { InitInputWindowData, InputWindowData } from '@/store/ourExtension/layoutsData/inputWindow/types'
import { SelectListInitData } from '@/store/ourExtension/layoutsData/selectListWindow/types'
import { PrintingDiapasonForMoonraker } from '@/store/ourExtension/profiles/types'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class WindowsMixin extends Vue {
    openInputWindow(defaultImplementation: boolean, coordName: string, initValue: number, valcoderStep: number, dispachAfterConfirm?: string, callbackAfterConfirm?: Function,
        maxValue?: number, minValue?: number, rejectPointClick?: boolean, coordUnits?: string, isItTime?: boolean) {
        if (!dispachAfterConfirm) {
            dispachAfterConfirm = 'void'
        }

        const inputWindowData: InputWindowData = {
            coordName: coordName,
            initValue: initValue,
            dispachAfterConfirm: dispachAfterConfirm,
            callbackAfterConfirm: callbackAfterConfirm,
            maxValue: maxValue,
            minValue: minValue,
            rejectPointClick: rejectPointClick,
            coordUnits: coordUnits,
            isItTime: isItTime
        }
        const initInfo: InitInputWindowData = {
            inputWindowData: inputWindowData,
            valcoderStep: valcoderStep,
        }
        if (defaultImplementation) {
            this.$store.dispatch('ourExtension/layoutsData/inputWindow/initInputWindow', initInfo);
        } else {
            this.$store.dispatch('ourExtension/layoutsData/inputWindow/initNotDefaultInputWindow', initInfo);
        }
        this.$store.dispatch('ourExtension/windowFlags/openInputWindow');
    }

    openSelectWindowWithoutIcon(callback: Function, initList: string[], z_index?: number) {
        const initData: SelectListInitData = {
            callbackAfterConfirm: callback,
            initList: initList,
            zIndex: z_index
        }


        this.$store.dispatch('ourExtension/layoutsData/selectListWindow/reset')
        this.$store.dispatch('ourExtension/layoutsData/selectListWindow/initWithoutIcons', initData)
        this.$store.dispatch('ourExtension/windowFlags/openSelectListWindow')
    }

    openSelectWindowWithIcon(callback: Function, initMap: Map<string, string>) {  // Текст иконки, текст элемента
        const initData: SelectListInitData = {
            callbackAfterConfirm: callback,
            initMap: initMap
        }


        this.$store.dispatch('ourExtension/layoutsData/selectListWindow/reset')
        this.$store.dispatch('ourExtension/layoutsData/selectListWindow/initWithIcons', initData)
        this.$store.dispatch('ourExtension/windowFlags/openSelectListWindow')
    }

    openExisitingPrintingWindow(needAlert = false) {
        let hasFile = this.$store.getters['ourExtension/layoutsData/printingWindow/hasFile']()
        const hasPrintingDiapason = this.$store.getters['ourExtension/layoutsData/printingWindow/hasPrintingDiapason']()
        const printerFile = this.$store.state.printer.printer.current_file
        const fileInWindow = this.$store.getters['ourExtension/layoutsData/printingWindow/getFile']() as FileData
        if (hasFile && printerFile.filename && printerFile.filename !== fileInWindow.name) {  // Если вдруг случилась подмена файлов
            hasFile = false
        }

        if (!hasFile || !hasPrintingDiapason) {
            this.$store.dispatch('ourExtension/layoutsData/printingWindow/reset')
            const file = this.resolveFileForPrintingWindow()
            this.$store.dispatch('ourExtension/layoutsData/printingWindow/setFile', file)
            const diapasonForMoonraker: PrintingDiapasonForMoonraker = {
                allLayersFlag: true,
                firstLayer: null,
                lastLayer: null,
                profile: this.$store.getters['ourExtension/profiles/getLastPrintingProfile'](),
            }
            const diapasonCopy = JSON.parse(JSON.stringify(diapasonForMoonraker))
            this.$store.dispatch('ourExtension/layoutsData/printingWindow/setPrintingDiapason', diapasonCopy)
        }

        // if (!hasFile || !hasPrintingDiapason) {
        //     this.$store.dispatch('ourExtension/layoutsData/printingWindow/reset')
        // }

        // if (!hasFile) {
        // const file = this.resolveFileForPrintingWindow()
        // this.$store.dispatch('ourExtension/layoutsData/printingWindow/setFile', file)
        // }

        // if (!hasPrintingDiapason) {
        //     const diapasonForMoonraker: PrintingDiapasonForMoonraker = {
        //         allLayersFlag: true,
        //         firstLayer: null,
        //         lastLayer: null,
        //         profile: this.$store.getters['ourExtension/profiles/getLastPrintingProfile'](),
        //     }
        //     const diapasonCopy = JSON.parse(JSON.stringify(diapasonForMoonraker))
        //     this.$store.dispatch('ourExtension/layoutsData/printingWindow/setPrintingDiapason', diapasonCopy)
        // }

        this.$store.dispatch('ourExtension/windowFlags/openPrintingWindow')


        const alert: AlertType = {
            message: 'Печать невозможна. Принтер уже печатает',
            type: 'ok'
        }
        if (needAlert) {
            this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
        }

    }

    resolveFileForPrintingWindow(): FileData {
        let file: FileData = this.$store.getters['ourExtension/files/getLastPrintingFile']()
        if (!file) {
            file = this.getFileMock()
        }
        const printerFile = this.$store.state.printer.printer.current_file
        if (printerFile.filename) {
            file.name = printerFile.filename
        }
        return file
    }

    getFileMock(): FileData {
        const profiles: GcodePrintingProfiles = {
            profiles: this.$store.getters['ourExtension/profiles/getDefaultProfilesMap'],
            selectedDiapason: {
                isRootDiapason: true,
                profile: this.$store.getters['ourExtension/profiles/getLastPrintingProfile'](),
            }
        }

        return {
            computedSize: '0',
            dirnameForMoonraker: '',
            isSelected: false,
            layers: "?",
            modified: '--.--.----',
            name: 'some_file.gcode',
            pathForMoonraker: 'some_file.gcode',
            permissions: 'rw',
            printingTime: "?h ?m",
            size: 0,
            sizeInKb: '0',
            profiles: profiles
        }
    }

    screenIsBlockingAlert() {
        const alert: InfoAlertType = {
            message: `<span>Экран заблокирован. Для разблокировки удерживайте кнопку настроек в течение 1 секунды</span>
                <style>
                .info-alert span {
                    text-align: center;
                }
                </style>`,
            type: 'red',
        }
        Alerts.showInfoAlert(alert)
    }
}