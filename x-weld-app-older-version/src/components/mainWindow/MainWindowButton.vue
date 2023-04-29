<template>
    <button @click="clickHandler">
        <img :src="buttonData.buttonImage">
        <span>{{ buttonData.buttonName }}</span>
    </button>
</template>


<script lang="ts">
import { SocketActions } from '@/api/socketActions';
import FilesMixin from '@/mixins/files';
import ServicesMixin from '@/mixins/services';
import StateMixin from '@/mixins/state';
import WindowsMixin from '@/mixins/windows';
import { FileData, LastPrintingFile } from '@/store/ourExtension/files/types';
import { AlertType, InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { MainWindowButtonInfo } from '@/store/ourExtension/layoutsData/mainWindow/types';
import { PrintingDiapason, PrintingDiapasonForMoonraker, Profile } from '@/store/ourExtension/profiles/types';
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class MainWindowButton extends Mixins(StateMixin, FilesMixin, ServicesMixin, WindowsMixin) {

    @Prop({ required: true })
    readonly buttonData!: MainWindowButtonInfo;


    async clickHandler() {
        if (this.buttonData.buttonName === 'Открыть файл') {
            this.openFileBrowseWindow()
        } else if (this.buttonData.buttonName === 'Конфигурация') {
            this.$store.dispatch('ourExtension/layoutsData/profilesWindow/reset')
            this.$store.dispatch('ourExtension/layoutsData/profilesWindow/initWithGlobalProfiles')
            this.$store.dispatch('ourExtension/windowFlags/openProfilesWindow')
        } else if (this.buttonData.buttonName === 'Допечатная подготовка') {
            this.$store.dispatch('ourExtension/layoutsData/preprintingWindow/reset')
            this.$store.dispatch('ourExtension/windowFlags/openPreprintingWindow');
        } else {
            this.openExisitingPrintingWindow()


            // if (this.printerPrinting) {
            //     this.openExisitingPrintingWindow()
            //     return
            // }

            // if (this.printerBusy) {
            //     this.showBusyAlert()
            //     return
            // }

            // this.printLastPrintingFile()


            // console.log(this.$store.state.files)
            // console.log(this.$store.state.printer)

            // if (this.printerPrinting) {
            //     this.openExisitingPrintingWindow()
            //     return
            // }
            // if (this.printerBusy) {
            //     this.showBusyAlert()
            //     return
            // }

            // const file: LastPrintingFile = this.$store.getters['ourExtension/files/getLastPrintingFile']()
            // if (file) {
            //     const callback = this.printFile.bind(this, file.diapason, file.file)
            //     const profileName = file.diapason.profile.name
            //     if (!file.diapason.allLayersFlag) {
            //         const firstLayer = file.diapason.firstLayer
            //         const lastLayer = file.diapason.lastLayer
            //         const alert: AlertType = {
            //             message: `Начать печать файла ${file.file.name} (${firstLayer}-${lastLayer}). Профиль: ${profileName}?`,
            //             type: 'yes_no',
            //             confirmCallback: callback
            //         }
            //         this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
            //     } else {
            //         const alert: AlertType = {
            //             message: `Начать печать файла ${file.file.name} (Все слои). Профиль: ${profileName}?`,
            //             type: 'yes_no',
            //             confirmCallback: callback
            //         }
            //         this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
            //     }

            // } else {
            //     const infoAlert: InfoAlertType = {
            //         message: 'Не найден последний напечатанный файл',
            //         type: 'red'
            //     }
            //     this.$store.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', infoAlert)
            //     this.openFileBrowseWindow()
            // }
        }
    }

    printLastPrintingFile() {
        const file: LastPrintingFile = this.$store.getters['ourExtension/files/getLastPrintingFile']()
        if (file) {
            const callback = this.printFile.bind(this, file.diapason, file.file)
            const profileName = file.diapason.profile.name
            if (!file.diapason.allLayersFlag) {
                const firstLayer = file.diapason.firstLayer
                const lastLayer = file.diapason.lastLayer
                const alert: AlertType = {
                    message: `Начать печать файла ${file.file.name} (${firstLayer}-${lastLayer}). Профиль: ${profileName}?`,
                    type: 'yes_no',
                    confirmCallback: callback
                }
                this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
            } else {
                const alert: AlertType = {
                    message: `Начать печать файла ${file.file.name} (Все слои). Профиль: ${profileName}?`,
                    type: 'yes_no',
                    confirmCallback: callback
                }
                this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
            }

        } else {
            const infoAlert: InfoAlertType = {
                message: 'Не найден последний напечатанный файл',
                type: 'red'
            }
            this.$store.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', infoAlert)
            this.openFileBrowseWindow()
        }
    }

    printFile(diapason: PrintingDiapasonForMoonraker, file: FileData) {
        if (this.printerBusy) {
            const infoAlert: InfoAlertType = {
                message: 'Принтер занят. Печать невозможна',
                type: 'red'
            }
            this.$store.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', infoAlert)
        } else {
            this.sendProfileAndOpenPrintingWindow(diapason, file)
            this.startPrint(file)
        }
    }

    startPrint(file: FileData) {
        // SocketActions.printerPrintStart(file.pathForMoonraker)
    }

    openFileBrowseWindow() {
        this.$store.dispatch('ourExtension/layoutsData/newFileBrowseWindow/setCurrentPath', 'gcodes')
        this.$store.dispatch('ourExtension/windowFlags/openFileBrowseWindow')
    }

    // openExsistingWindow() {
    //     this.$store.dispatch('ourExtension/windowFlags/openPrintingWindow')
    //     const alert: AlertType = {
    //         message: 'Печать невозможна. Принтер уже печатает',
    //         type: 'ok'
    //     }
    //     this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
    // }

    showBusyAlert() {
        const alert: AlertType = {
            header: 'ОШИБКА!',
            message: 'Печать невозможна. Принтер занят',
            type: 'ok'
        }
        this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
    }
}
</script>
