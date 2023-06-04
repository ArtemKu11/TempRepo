<template>
    <button @click="clickHandler"
        :class="{ 'disabled': !isFileSelected && buttonData.buttonName !== 'Открыть файл' && buttonData.buttonName !== 'Конфигурация' }">
        <img v-if="!buttonData.activeButtonImage" :src="buttonData.buttonImage">
        <img v-else :src="calculatedButtonImage">
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
import { PrintingDiapason, PrintingDiapasonForMoonraker } from '@/store/ourExtension/profiles/types';
import { Component, Mixins, Prop } from 'vue-property-decorator';

@Component({})
export default class MainWindowButton extends Mixins(StateMixin, FilesMixin, ServicesMixin, WindowsMixin) {

    @Prop({ required: true })
    readonly buttonData!: MainWindowButtonInfo;

    get isFileSelected(): FileData {
        return this.$store.getters['ourExtension/layoutsData/filePreviewWindow/getFile']()
    }

    get selectedDiapason(): PrintingDiapason {
        return this.$store.getters['ourExtension/layoutsData/filePreviewWindow/getSelectedDiapason']()
    }

    get calculatedButtonImage() {
        if (this.isFileSelected && this.buttonData.activeButtonImage) {
            return this.buttonData.activeButtonImage
        }
        return this.buttonData.buttonImage
    }

    get lastPrintingProfile() {
        return this.$store.getters['ourExtension/profiles/getLastPrintingProfile']()
    }

    async clickHandler() {
        if (this.buttonData.buttonName === 'Открыть файл') {
            this.openFileBrowseWindow()
        } else if (this.buttonData.buttonName === 'Конфигурация') {
            this.$store.dispatch('ourExtension/layoutsData/profilesWindow/reset')
            this.$store.dispatch('ourExtension/layoutsData/profilesWindow/initWithGlobalProfiles')
            this.$store.dispatch('ourExtension/windowFlags/openProfilesWindow')
        } else if (this.buttonData.buttonName === 'Допечатная подготовка') {
            if (!this.isFileSelected) {
                return;
            }
            this.$store.dispatch('ourExtension/layoutsData/preprintingWindow/reset')
            this.$store.dispatch('ourExtension/windowFlags/openPreprintingWindow');
        } else {
            // this.openExisitingPrintingWindow()
            if (!this.isFileSelected) {
                return;
            }

            if (this.printerPrinting) {
                this.openExisitingPrintingWindow()
                return
            }

            if (this.printerBusy) {
                this.showBusyAlert()
                return
            }

            this.printLastPrintingFile()


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
        if (this.isFileSelected) {
            this.tryToStartPrintFile()



            // const profile = this.lastPrintingProfile
            // const diapason: PrintingDiapasonForMoonraker = {
            //     allLayersFlag: true,
            //     firstLayer: null,
            //     lastLayer: null,
            //     profile: profile
            // }
            // const callback = this.printFile.bind(this, diapason, file)
            // const profileName = diapason.profile.name
            // if (!diapason.allLayersFlag) {
            //     const firstLayer = diapason.firstLayer
            //     const lastLayer = diapason.lastLayer
            //     const alert: AlertType = {
            //         message: `Начать печать файла ${file.name} (${firstLayer}-${lastLayer}). Профиль: ${profileName}?`,
            //         type: 'yes_no',
            //         confirmCallback: callback
            //     }
            //     this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
            // } else {
            //     const alert: AlertType = {
            //         message: `Начать печать файла ${file.name} (Все слои). Профиль: ${profileName}?`,
            //         type: 'yes_no',
            //         confirmCallback: callback
            //     }
            //     this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
            // }
        } else {
            const infoAlert: InfoAlertType = {
                message: 'Не найден последний напечатанный файл',
                type: 'red'
            }
            this.$store.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', infoAlert)
            this.openFileBrowseWindow()
        }

        // const file: LastPrintingFile = this.$store.getters['ourExtension/files/getLastPrintingFile']()
        // if (file) {
        //     const callback = this.printFile.bind(this, file.diapason, file.file)
        //     const profileName = file.diapason.profile.name
        //     if (!file.diapason.allLayersFlag) {
        //         const firstLayer = file.diapason.firstLayer
        //         const lastLayer = file.diapason.lastLayer
        //         const alert: AlertType = {
        //     message: `Начать печать файла ${file.file.name} (${firstLayer}-${lastLayer}). Профиль: ${profileName}?`,
        //     type: 'yes_no',
        //     confirmCallback: callback
        // }
        // this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
        //     } else {
        // const alert: AlertType = {
        //     message: `Начать печать файла ${file.file.name} (Все слои). Профиль: ${profileName}?`,
        //     type: 'yes_no',
        //     confirmCallback: callback
        // }
        // this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
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

    tryToStartPrintFile() {
        let diapasonForMoonraker: PrintingDiapasonForMoonraker;
        let allLayersFlag = true
        let firstLayer = null
        let lastLayer = null

        if (this.selectedDiapason) {
            if (this.selectedDiapason.firstLayer && this.selectedDiapason.lastLayer &&
                !isNaN(parseInt(this.selectedDiapason.firstLayer + '')) && !isNaN(parseInt(this.selectedDiapason.lastLayer + ''))) {
                allLayersFlag = false
                firstLayer = +this.selectedDiapason.firstLayer
                lastLayer = +this.selectedDiapason.lastLayer
            }
            diapasonForMoonraker = {
                profile: JSON.parse(JSON.stringify(this.selectedDiapason.profile)),
                allLayersFlag: allLayersFlag,
                firstLayer: firstLayer,
                lastLayer: lastLayer
            }

            const callback = this.printFile.bind(this, diapasonForMoonraker, this.isFileSelected)
            let message = "";
            if (diapasonForMoonraker.allLayersFlag) {
                message = `Начать печать файла ${this.isFileSelected.name} (Все слои) Профиль: ${diapasonForMoonraker.profile.name}?`
            } else {
                message = `Начать печать файла ${this.isFileSelected.name} (${diapasonForMoonraker.firstLayer} - ${diapasonForMoonraker.lastLayer}) Профиль: ${diapasonForMoonraker.profile.name}?`
            }
            const alert: AlertType = {
                type: 'yes_no',
                message: message,
                header: 'ВНИМАНИЕ!',
                confirmCallback: callback,
            }
            this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)

        } else {
            const profile = this.lastPrintingProfile
            diapasonForMoonraker = {
                profile: JSON.parse(JSON.stringify(profile)),
                allLayersFlag: true,
                firstLayer: null,
                lastLayer: null
            }
            const callback = this.printFile.bind(this, diapasonForMoonraker, this.isFileSelected)
            const alert: AlertType = {
                message: `Начать печать файла ${this.isFileSelected.name} (Все слои). Профиль последней печати (${diapasonForMoonraker.profile.name})?`,
                type: 'yes_no',
                confirmCallback: callback
            }
            this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
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
