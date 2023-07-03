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
                <FolderButton v-for="(directoryData, index) in directoryList" :key="index" :directoryData="directoryData" />
                <FileButton v-for="(fileData, index) in fileList" :key="-index - 1" :fileData="fileData" />
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
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
import FileButton from './FileButton.vue';
import FolderButton from './FolderButton.vue';
import { AlertType, InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers';
import { mockHelper } from '@/helpers/mockHelper';
import StateMixin from '@/mixins/state';
import WindowsMixin from '@/mixins/windows';
import GpioMixin from '@/mixins/gpio';

import { PrintingDiapasonForMoonraker } from '@/store/ourExtension/profiles/types';
import FilesMixin from '@/mixins/files';



@Component({
    components: {
        FileButton, FolderButton
    },
})
export default class FileSelectWindow extends Mixins(StateMixin, WindowsMixin, FilesMixin, GpioMixin) {

    buttonsState = {  // флаги для бинда .active класса для мнгновенной подмены картинок по touchstart
        firstButton: false,  // Информация о файле
        secondButton: false,  // Режимы наплавки
        thirdButton: false,  // Допечатная подготовка
        fourthButton: false,  // Выбор
        fifthButton: false,  // Отмена
        sixthButton: false  // Главное меню
    }

    get absolutelyEmpty(): boolean {
        return !this.isDirectorySelected && !Boolean(this.fileList) && !Boolean(this.directoryList)
    }

    get fileList(): Array<FileData> {
        return this.$store.getters['ourExtension/layoutsData/newFileBrowseWindow/getFileList']()
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
        this.setAllButtonsPressed(false)
    }

    deactivateFiles() {
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
    }

    touchStartHandler(e: TouchEvent, button: string) {
        if (button in this.buttonsState) {
            this.setAllButtonsPressed(false)
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
            case "fifthButton":  // Выбор
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
        this.tryToStartPrint();  // TODO раскоммениторовать и убрать
        // const selectedFile = this.selectedFile
        // const selectedDirectory = this.selectedDirectory
        // if (selectedFile) {
        //     this.tryToStartPrint()
        //     return
        // }
        // if (selectedDirectory) {
        //     this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
        //     const newPath = this.currentPath + "/" + selectedDirectory.name
        //     this.$store.dispatch('ourExtension/layoutsData/newFileBrowseWindow/setCurrentPath', newPath);
        //     return
        // }
        // const alert: InfoAlertType = {
        //     message: "Ничего не выбрано",
        //     type: 'red'
        // }
        // Alerts.showInfoAlert(alert)
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
        const selectedFile = mockHelper.getFileDataMock()
        // const selectedFile = this.selectedFile  // Поменять местами
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
        this.initNewPrintingWindow(diapasonForMoonraker, file)
        this.$router.push('/print')
        // const response = await this.sendProfile(diapasonForMoonraker)  // TODO убрать первые 2 строки и раскомментировать
        // if (response.status && response.status === 201) {
        //     const lastPrintingFile: LastPrintingFile = {
        //         diapason: diapasonForMoonraker,
        //         file: file
        //     }
        //     this.$store.commit('ourExtension/files/setLastPrintingFile', lastPrintingFile)
        //     this.initNewPrintingWindow(diapasonForMoonraker, file)
        //     this.$router.push('/print')
        // } else {
        //     const alert: InfoAlertType = {
        //         message: "Не удалось отправить профиль печати",
        //         type: 'red'
        //     }
        //     Alerts.showInfoAlert(alert)
        // }
    }

    openPreviousDirectory() {
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
        const lastSlash = this.currentPath.lastIndexOf('/')
        if (lastSlash != -1) {
            const newPath = this.currentPath.slice(0, lastSlash)
            this.$store.dispatch('ourExtension/layoutsData/newFileBrowseWindow/setCurrentPath', newPath);
        }
    }


    /// GPIO SUPPORT:

    // 1. Унаследоваться от GpioMixin
    // 2. beforeDestroy: this.setAllButtonsPressed(false)
    // 3. touchStartHandler: this.setAllButtonsPressed(false)
    // 4. Скопировать все нижележащее 

    gpioButtonDownEventHandler(button: string) {
        if (button in this.buttonsState) {
            const state = this.buttonsState as any
            state[button] = true
        }
    }

    gpioButtonUpEventHandler(button: string, needToResolveClick = true) {
        if (button in this.buttonsState) {
            const state = this.buttonsState as any
            state[button] = false
            if (needToResolveClick) {
                this.resolveButtonClick(button)
            }
        }
    }

    @Watch('isFirstButtonPressed')
    firstButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isFirstButtonPressed
        if (isPressed) {
            this.gpioButtonDownEventHandler('firstButton')
        } else {
            if (!this.buttonsInterrups.firstButton) {
                this.gpioButtonUpEventHandler('firstButton')
            } else {
                this.gpioButtonUpEventHandler('firstButton', false)
            }
        }
    }

    @Watch('isSecondButtonPressed')
    secondButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isSecondButtonPressed
        if (isPressed) {
            this.gpioButtonDownEventHandler('secondButton')
        } else {
            if (isPressed) {
                this.gpioButtonUpEventHandler('secondButton')
            } else {
                if (!this.buttonsInterrups.secondButton) {
                    this.gpioButtonUpEventHandler('secondButton')
                } else {
                    this.gpioButtonUpEventHandler('secondButton', false)
                }
            }
        }
    }

    @Watch('isThirdButtonPressed')
    thirdButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isThirdButtonPressed
        if (isPressed) {
            this.gpioButtonDownEventHandler('thirdButton')
        } else {
            if (!this.buttonsInterrups.thirdButton) {
                this.gpioButtonUpEventHandler('thirdButton')
            } else {
                this.gpioButtonUpEventHandler('thirdButton', false)
            }
        }
    }

    @Watch('isFourthButtonPressed')
    fourthButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isFourthButtonPressed
        if (isPressed) {
            this.gpioButtonDownEventHandler('fourthButton')
        } else {
            if (!this.buttonsInterrups.fourthButton) {
                this.gpioButtonUpEventHandler('fourthButton')
            } else {
                this.gpioButtonUpEventHandler('fourthButton', false)
            }
        }
    }

    @Watch('isFifthButtonPressed')
    fifthButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isFifthButtonPressed
        if (isPressed) {
            this.gpioButtonDownEventHandler('fifthButton')
        } else {
            if (!this.buttonsInterrups.fifthButton) {
                this.gpioButtonUpEventHandler('fifthButton')
            } else {
                this.gpioButtonUpEventHandler('fifthButton', false)
            }
        }
    }

    @Watch('isSixthButtonPressed')
    sixthButtonWather(newValue: boolean, oldValue: boolean) {
        const isPressed = this.isSixthButtonPressed
        if (isPressed) {
            this.gpioButtonDownEventHandler('sixthButton')
        } else {
            if (!this.buttonsInterrups.sixthButton) {
                this.gpioButtonUpEventHandler('sixthButton')
            } else {
                this.gpioButtonUpEventHandler('sixthButton', false)
            }
        }
    }

    /// TEMPLATE:

    // @Watch('isFirstButtonPressed')
    // firstButtonWather() {
    //     const isPressed = this.isFirstButtonPressed
    //     if (isPressed) {
    //         console.log('Нажата первая кнопка')
    //     } else {
    //         console.log('Отпущена первая кнопка')
    //     }
    // }

    // @Watch('isSecondButtonPressed')
    // secondButtonWather() {
    //     const isPressed = this.isSecondButtonPressed
    //     if (isPressed) {
    //         console.log('Нажата вторая кнопка')
    //     } else {
    //         console.log('Отпущена вторая кнопка')
    //     }
    // }

    // @Watch('isThirdButtonPressed')
    // thirdButtonWather() {
    //     const isPressed = this.isThirdButtonPressed
    //     if (isPressed) {
    //         console.log('Нажата третья кнопка')
    //     } else {
    //         console.log('Отпущена третья кнопка')
    //     }
    // }

    // @Watch('isFourthButtonPressed')
    // fourthButtonWather() {
    //     const isPressed = this.isFourthButtonPressed
    //     if (isPressed) {
    //         console.log('Нажата четвертая кнопка')
    //     } else {
    //         console.log('Отпущена четвертая кнопка')
    //     }
    // }

    // @Watch('isFifthButtonPressed')
    // fifthButtonWather() {
    //     const isPressed = this.isFifthButtonPressed
    //     if (isPressed) {
    //         console.log('Нажата пятая кнопка')
    //     } else {
    //         console.log('Отпущена пятая кнопка')
    //     }
    // }

    // @Watch('isSixthButtonPressed')
    // sixthButtonWather() {
    //     const isPressed = this.isSixthButtonPressed
    //     if (isPressed) {
    //         console.log('Нажата шестая кнопка')
    //     } else {
    //         console.log('Отпущена шестая кнопка')
    //     }
    // }
}
</script>


<style lang="scss">
@import '@/style/fileSelectWindow/css/fileSelectWindow.scss';
</style>`