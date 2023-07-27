<template>
    <div class="content-container open-file-layout">
        <div id="content-header"><img src="@/layouts/open_file_layout/img/xweld_logo.svg"></div>
        <div id="content-center">
            <!-- <img src="@/layouts/open_file_layout/img/printing_file_icon.png"> -->
            <div class="no-image-div"><img src="@/layouts/open_file_layout/img/xweld_logo.svg"></div>
            <div id="file-info-holder">
                <span>{{ fileData.name }}</span>
                <span>Время печати: {{ fileData.printingTime }}</span>
                <span>Количество слоев: {{ fileData.layers }}</span>
                <span>Размер файла: {{ fileData.sizeInKb }}kb</span>
            </div>
        </div>
        <div id="content-footer">
            <div class="one-button-wrapper">
                <button @click="openPreviousWindow">
                    <div class="img-wrapper">
                        <img src="@/layouts/open_file_layout/img/open_icon.png">
                    </div>
                    <span>Открыть</span>
                </button>
            </div>
            <div class="two-buttons-wrapper">
                <button @click="openPreprintingWindow">
                    <div class="img-wrapper">
                        <img src="@/layouts/open_file_layout/img/move_icon.png">
                    </div>
                    <span>Допечатная подготовка</span>
                </button>
                <button @click="openProfilesWindow">
                    <div class="img-wrapper">
                        <img src="@/layouts/open_file_layout/img/profiles_icon.png">
                    </div>
                    <span>Профили</span>
                </button>
            </div>
            <div class="one-button-wrapper">
                <button @click="printClickHandler">
                    <div class="img-wrapper">
                        <img src="@/layouts/open_file_layout/img/print_icon.png">
                    </div>
                    <span>Печать</span>
                </button>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { SocketActions } from '@/api/socketActions';
import FilesMixin from '@/mixins/files';
import StateMixin from '@/mixins/state';
import WindowsMixin from '@/mixins/windows';
import { FileData, LastPrintingFile } from '@/store/ourExtension/files/types';
import { AlertType, InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { PrintingDiapason, PrintingDiapasonForMoonraker, Profile } from '@/store/ourExtension/profiles/types';
import { Component, Mixins, Vue } from 'vue-property-decorator';

@Component({})
export default class FilePreviewWindow extends Mixins(FilesMixin, StateMixin, WindowsMixin) {

    get selectedDiapason(): PrintingDiapason {
        return this.$store.getters['ourExtension/layoutsData/filePreviewWindow/getSelectedDiapason']()
    }

    get fileData(): FileData {
        return this.$store.getters['ourExtension/layoutsData/filePreviewWindow/getFileData']()
    }

    get lastPrintingProfile(): Profile {
        return this.$store.getters['ourExtension/profiles/getLastPrintingProfile']()
    }

    openProfilesWindow() {
        const confirmCallback = this.selectedPrintingDiapasonReceiver.bind(this)
        this.$store.dispatch('ourExtension/layoutsData/profilesWindow/reset')
        this.$store.dispatch('ourExtension/layoutsData/profilesWindow/setFile', this.fileData)
        this.$store.dispatch('ourExtension/layoutsData/profilesWindow/setCallback', confirmCallback)
        this.$store.dispatch('ourExtension/windowFlags/openProfilesWindowWithStackSave')
    }

    openPreviousWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow')
    }

    openPreprintingWindow() {
        this.$store.dispatch('ourExtension/layoutsData/preprintingWindow/reset')
        this.$store.dispatch('ourExtension/layoutsData/preprintingWindow/initByFile', this.fileData)
        this.$store.dispatch('ourExtension/windowFlags/openPreprintingWindow')
    }

    selectedPrintingDiapasonReceiver(selectedDiapason: PrintingDiapason) {
        this.$store.commit('ourExtension/layoutsData/filePreviewWindow/setSelectedDiapason', selectedDiapason)
    }

    async printClickHandler() {
        if (this.printerPrinting || this.printerPaused) {
            const alert: AlertType = {
                message: 'Принтер уже печатает. Открыто окно текущей печати',
                type: 'ok'
            }
            this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
            this.openExisitingPrintingWindow()
            return
        }
        const printerState = this.printerState.toLowerCase()
        if (printerState === 'busy') {
            this.showBusyAlert()
            return
        }

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
            this.printFile(diapasonForMoonraker, this.fileData)
        } else {
            const profile = this.lastPrintingProfile
            diapasonForMoonraker = {
                profile: JSON.parse(JSON.stringify(profile)),
                allLayersFlag: true,
                firstLayer: null,
                lastLayer: null
            }
            const callback = this.printFile.bind(this, diapasonForMoonraker, this.fileData)
            const alert: AlertType = {
                type: 'yes_no',
                message: 'Вы не применили профиль для печати. Использовать профиль последней печати? (Все слои)',
                header: 'ВНИМАНИЕ!',
                confirmCallback: callback,
            }
            this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
        }
    }

    async printFile(diapasonForMoonraker: PrintingDiapasonForMoonraker, file: FileData) {
        if (this.printerBusy) {
            const infoAlert: InfoAlertType = {
                message: 'Принтер занят. Печать невозможна',
                type: 'red'
            }
            this.$store.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', infoAlert)
        } else {
            const response = await this.sendProfileAndOpenPrintingWindow(diapasonForMoonraker, file)
            if (response.status && response.status === 201) {
                const lastPrintingFile: LastPrintingFile = {
                    diapason: diapasonForMoonraker,
                    file: file
                }
                this.$store.commit('ourExtension/files/setLastPrintingFile', lastPrintingFile)
            }
            // this.startPrint(file)
        }
    }

    startPrint(file: FileData) {
        SocketActions.printerPrintStart(file.pathForMoonraker)
    }

    openExsistingWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openPrintingWindow')
        const alert: AlertType = {
            message: 'Печать невозможна. Принтер уже печатает',
            type: 'ok'
        }
        this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
    }

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


<style lang="scss">@import '@/layouts/open_file_layout/css/open_file_layout.scss';</style>