<template>
    <div class="file-select-window">
        <div class="header">
            <div class="a-icon">a</div>
            <span>Прокрутка файлов</span>
        </div>

        <div v-if="absolutelyEmpty" class="files-not-found">
            <span>Файлов не найдено</span>
        </div>

        <div v-else class="files-wrapper">
            <button v-if="isDirectorySelected" @touchstart="openPreviousDirectory" class="upper-folder">
                <div class="description">
                    <img src="@/style/fileSelectWindow/img/upper_folder.svg" alt="">
                    <span>..</span>
                </div>
                <hr>
            </button>
            <div class="files-list">
                <FileButton v-for="(fileData, index) in fileList" :key="-index - 1" :fileData="fileData" />
                <FolderButton v-for="(directoryData, index) in directoryList" :key="index" :directoryData="directoryData" />
            </div>
        </div>

        <div class="control-buttons">
            <button :class="{ 'active': buttonsState.firstButton }" @touchstart="touchStartHandler($event, 'firstButton')"
                @touchend="touchEndHandler('firstButton')" class="control-button info">
                <div class="img-wrapper">
                    <img src="@/style/fileSelectWindow/img/info.svg" alt="">
                </div>
                <span>Информация о файле</span>
            </button>

            <button :class="{ 'active': buttonsState.secondButton }" @touchstart="touchStartHandler($event, 'secondButton')"
                @touchend="touchEndHandler('secondButton')" class="control-button profiles">
                <div class="img-wrapper">
                    <img src="@/style/fileSelectWindow/img/star.svg" alt="">
                </div>
                <span>Режимы наплавки</span>
            </button>

            <button :class="{ 'active': buttonsState.thirdButton }" @touchstart="touchStartHandler($event, 'thirdButton')"
                @touchend="touchEndHandler('thirdButton')" class="control-button preprint">
                <div class="img-wrapper">
                    <img src="@/style/fileSelectWindow/img/settings.svg" alt="">
                </div>
                <span>Допечатная подготовка</span>
            </button>

            <button :class="{ 'active': buttonsState.fourthButton }" @touchstart="touchStartHandler($event, 'fourthButton')"
                @touchend="touchEndHandler('fourthButton')" class="control-button revert select">
                <span>Выбор</span>
                <div class="img-wrapper">
                    <img src="@/style/fileSelectWindow/img/select.svg" alt="">
                </div>
            </button>

            <button :class="{ 'active': buttonsState.fifthButton }" @touchstart="touchStartHandler($event, 'fifthButton')"
                @touchend="touchEndHandler('fifthButton')" class="control-button revert cancel">
                <span>Отмена</span>
                <div class="img-wrapper">
                    <img src="@/style/fileSelectWindow/img/cancel.svg" alt="">
                </div>
            </button>

            <button :class="{ 'active': buttonsState.sixthButton }" @touchstart="touchStartHandler($event, 'sixthButton')"
                @touchend="touchEndHandler('sixthButton')" class="control-button revert menu">
                <span>Главное меню</span>
                <div class="img-wrapper">
                    <img src="@/style/fileSelectWindow/img/menu.svg" alt="">
                </div>
            </button>
        </div>
    </div>
</template>


<script lang="ts">
import { DirectoryData, FileData, LastPrintingFile } from '@/store/ourExtension/files/types';
import { Component, Mixins, Vue } from 'vue-property-decorator';
import FileButton from './FileButton.vue';
import FolderButton from './FolderButton.vue';
import { AlertType, InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers';
import { mockHelper } from '@/helpers/mockHelper';
import StateMixin from '@/mixins/state';
import WindowsMixin from '@/mixins/windows';
import { PrintingDiapasonForMoonraker } from '@/store/ourExtension/profiles/types';
import FilesMixin from '@/mixins/files';



@Component({
    components: {
        FileButton, FolderButton
    },
})
export default class FileSelectWindow extends Mixins(StateMixin, WindowsMixin, FilesMixin) {

    buttonsState = {  // флаги для бинда .active класса для мнгновенной подмены картинок по touchstart
        firstButton: false,  // Информация о файле
        secondButton: false,  // Режимы наплавки
        thirdButton: false,  // Допечатная подготовка
        fourthButton: false,  // Выбор
        fifthButton: false,  // Отмена
        sixthButton: false  // Главное меню
    }

    get absolutelyEmpty(): boolean {
        return !this.isDirectorySelected && Boolean(this.fileList) && Boolean(this.directoryList)
    }

    get fileList(): Array<FileData> {
        return this.$store.getters['ourExtension/layoutsData/newFileBrowseWindow/getFileList']
    }

    get directoryList(): Array<FileData> {
        return this.$store.getters['ourExtension/layoutsData/newFileBrowseWindow/getDirectoryList']
    }

    get isDirectorySelected(): boolean {
        return this.currentPath !== "" && this.currentPath !== "gcodes"  // TODO в оригинале не было проверки на пустую строку
    }

    get selectedDirectory(): DirectoryData | null {
        return this.$store.getters['ourExtension/layoutsData/newFileBrowseWindow/getUsualSelectedDirectory']
    }

    get selectedFile(): FileData | null {
        return this.$store.getters['ourExtension/layoutsData/newFileBrowseWindow/getUsualSelectedFile']
    }

    get currentPath(): string {
        return this.$store.getters['ourExtension/layoutsData/newFileBrowseWindow/getCurrentPath']
    }

    mounted(): void {
        this.deactivateFiles()
    }

    beforeDestroy() {
        this.deactivateFiles()
    }

    deactivateFiles() {
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
    }

    touchStartHandler(e: TouchEvent, button: string) {
        if (button in this.buttonsState) {
            const state = this.buttonsState as any
            state[button] = true
            if (e.cancelable) {
                e.preventDefault()
                e.stopPropagation()
            }
            this.resolveButtonClick(button)
        }
    }

    resolveButtonClick(button: string) {
        switch (button) {
            case "fourthButton":  // Выбор
                this.selectButtonClick()
                return;
            default:
                return;
        }
    }

    touchEndHandler(button: string) {
        if (button in this.buttonsState) {
            const state = this.buttonsState as any
            state[button] = false
        }
    }

    selectButtonClick() {
        const selectedFile = this.selectedFile
        const selectedDirectory = this.selectedDirectory
        if (selectedFile) {
            this.tryToStartPrint()
            return
        }
        if (selectedDirectory) {
            this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
            const newPath = this.currentPath + "/" + selectedDirectory.name
            this.$store.dispatch('ourExtension/layoutsData/newFileBrowseWindow/setCurrentPath', newPath);
            return
        }
        const alert: InfoAlertType = {
            message: "Ничего не выбрано",
            type: 'red'
        }
        Alerts.showInfoAlert(alert)
    }

    tryToStartPrint() {
        if (this.printerPrinting || this.printerPaused) {
            const alert: AlertType = {
                message: 'Принтер уже печатает. Открыто окно текущей печати',
                type: 'ok'
            }
            this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
            this.initExisitingPrintingWindow()
            this.$router.push('/print')
            return
        } else {
            this.startNewPrint()
        }
    }

    fileMustBeSelectedAlert() {
        const alert: InfoAlertType = {
            message: "Ничего не выбрано",
            type: 'red'
        }
        Alerts.showInfoAlert(alert)
    }

    startNewPrint() {
        // const selectedFile = mockHelper.getFileDataMock()
        const selectedFile = this.selectedFile
        if (selectedFile) {

            this.$store.commit('ourExtension/files/setSelectedFile', selectedFile)

            let diapasonForMoonraker: PrintingDiapasonForMoonraker;
            let allLayersFlag = true
            let firstLayer = null
            let lastLayer = null
            let profile = this.$store.getters['ourExtension/profiles/getLastPrintingProfile']()  // TODO учесть логику выбора профилей
            if (!profile) {
                profile = mockHelper.getProfileMock()
            }
            diapasonForMoonraker = {
                profile: JSON.parse(JSON.stringify(profile)),
                allLayersFlag: true,
                firstLayer: null,
                lastLayer: null
            }
            this.printFile(diapasonForMoonraker, selectedFile)
        } else {
            this.fileMustBeSelectedAlert()
        }
    }

    async printFile(diapasonForMoonraker: PrintingDiapasonForMoonraker, file: FileData) {
        const response = await this.sendProfile(diapasonForMoonraker)
        if (response.status && response.status === 201) {
            const lastPrintingFile: LastPrintingFile = {
                diapason: diapasonForMoonraker,
                file: file
            }
            this.$store.commit('ourExtension/files/setLastPrintingFile', lastPrintingFile)
            this.initNewPrintingWindow(diapasonForMoonraker, file)
            this.$router.push('/print')
        } else {
            const alert: InfoAlertType = {
                message: "Не удалось отправить профиль печати",
                type: 'red'
            }
            Alerts.showInfoAlert(alert)
        }
    }

    openPreviousDirectory() {
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
        const lastSlash = this.currentPath.lastIndexOf('/')
        if (lastSlash != -1) {
            const newPath = this.currentPath.slice(0, lastSlash)
            this.$store.dispatch('ourExtension/layoutsData/newFileBrowseWindow/setCurrentPath', newPath);
        }
    }


}
</script>


<style lang="scss">
@import '@/style/fileSelectWindow/css/fileSelectWindow.scss';
</style>`