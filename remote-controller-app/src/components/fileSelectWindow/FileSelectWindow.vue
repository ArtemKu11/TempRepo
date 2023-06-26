<template>
    <div class="file-select-window">
        <div class="header">
            <div class="a-icon">a</div>
            <span>Прокрутка файлов</span>
        </div>

        <div class="files-wrapper">
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
import { DirectoryData, FileData } from '@/store/ourExtension/files/types';
import { Component, Vue } from 'vue-property-decorator';
import FileButton from './FileButton.vue';
import FolderButton from './FolderButton.vue';
import { AlertType, InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers';



@Component({
    components: {
        FileButton, FolderButton
    },
})
export default class FileSelectWindow extends Vue {

    buttonsState = {  // флаги для бинда .active класса для мнгновенной подмены картинок по touchstart
        firstButton: false,  // Информация о файле
        secondButton: false,  // Режимы наплавки
        thirdButton: false,  // Допечатная подготовка
        fourthButton: false,  // Выбор
        fifthButton: false,  // Отмена
        sixthButton: false  // Главное меню
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

    get selectedFile(): DirectoryData | null {
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
                this.openPrint()
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

    openPrint() {
        const selectedFile = this.selectedFile
        const selectedDirectory = this.selectedDirectory
        if (selectedFile) {
            this.$router.push('/print')
            return
        }
        if (selectedDirectory) {
            this.$router.push('/print')
            return
        }
        const alert: InfoAlertType = {
            message: "Ничего не выбрано",
            type: 'red'
        }
        Alerts.showInfoAlert(alert)
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