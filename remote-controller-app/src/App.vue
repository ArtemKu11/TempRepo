<template>
    <div @contextmenu.prevent="" id="app-child">
        <router-view></router-view>
        <DefaultAlert v-if="alertFlag" />
        <InfoAlert v-if="infoAlertFlag" />
        <!-- <FatalErrorAlert v-if="fatalErrorFlag" /> -->
    </div>
</template>

<script lang="ts">
// Подгрузка файлов и профилей:
// 1. socket -> actions -> onSocketOpen() -> вызывается два dispatch('ourExtension/files/getAllFilesAndDirs') на gcodes и на config директории
// 2. Далее в ourExtension/files/getAllFilesAndDirs выполняется SocketAction serverGetAllFilesAndDirs, по выполнению которого выполняется ourExtension/files/onGetAllFilesAndDirs
// 3. По итогу п.2 формируется рекурсивный объект, соответствующий файловой системе сервера, но пока без слоев, времени печати, профилей (как отдельно в state, так и в объектах FileData).
// Это объекты files и dirs в LightFilesState
// 4. Далее формируется объект fileSystem в LightFilesState (Словари string-FileData для папок config и gcodes, string - pathForMoonraker)
// Нужен для получения объектов из рекурсивного объекта, не прибегая к рекурсии
// pathForMoonraker: string,  // Путь до файла, включая имя файла, но без рут-директории (gcodes, config и т.д.). Если файл в корне рут-директории, то просто filename
// 5. Далее рекурсивно считается размер директорий по размеру файлов, входящих в эти директории
// 6. Далее флагами isLoadingFinish и isProfilesDownloadingFinished запускается логика в компоненте App (функции isFilesLoadingFinishedWather() и isProfilesDownloadingFinishedWather())
// 7. Функция isFilesLoadingFinishedWather сетает в FileData файлов директории gcodes количество слоев и время печати
// 8. Функция isProfilesDownloadingFinishedWather сетает получает с сервера содержимое файлов папки config/profiles,
// формирует Profile[] и выполняет 'ourExtension/profiles/setProfiles' и 'ourExtension/profiles/setProfilesMetadata'
// 9. В setProfiles() формуируется словарь профилей для файлов (<string, PrintingDiapason>) 
// и сетается lastPrintingProfile (Либо "Нержавеющие стали", либо первый по алфавиту)
// Словарь сетается по 'ourExtension/files/setProfilesForAllGcodes'
// setProfilesForAllGcodes сетает профили в FileData каждого gcode в состояние по умолчанию (lastSelectedDiapason = undefined, для каждого профиля только один диапазон)


import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';

import DefaultAlert from './components/alerts/DefaultAluert.vue';
import InfoAlert from './components/alerts/InfoAlert.vue';
import FatalErrorAlert from '@/components/alerts/FatalErrorAlert.vue'
import { FileData, FileSystem, DirectoryData } from './store/ourExtension/files/types';
import FilesMixin from './mixins/files';
import { parseGcode } from './workers/xWeldParser';
import { Profile } from './store/ourExtension/profiles/types'
import { isSatisfiesProfilesMetadataType, isSatisfiesProfileType } from './store/ourExtension/profiles/helpers';
import { AxiosResponse } from 'axios';
import StateMixin from './mixins/state';
import { AlertType, InfoAlertType } from './store/ourExtension/layoutsData/alerts/types';
import { SocketActions } from './api/socketActions';
import WindowsMixin from './mixins/windows';
import { Alerts } from './store/ourExtension/layoutsData/alerts/helpers';

@Component({
    components: {
        DefaultAlert, InfoAlert, FatalErrorAlert
    },
})
export default class App extends Mixins(FilesMixin, StateMixin, WindowsMixin) {

    isBlocking = false
    blockingTime = 0
    blockingTimeout: null | number = null
    backClickForConsole = false

    buttonFlags = {
        mainButton: false,
        moveButton: false,
        starButton: false,
        settingsButton: false,
        backButton: false
    }

    get fileSelect(): boolean {
        return this.$store.getters['ourExtension/temp/fileSelectWindowFlag']
    }

    get print(): boolean {
        return this.$store.getters['ourExtension/temp/printWindowFlag']
    }

    get osc(): boolean {
        return this.$store.getters['ourExtension/temp/oscillationWindowFlag']
    }

    get mainWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getMainWindowFlag'];
    }

    get fileBrowseWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getFileBrowseWindowFlag'];
    }

    get filePreviewWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getFilePreviewWindowFlag'];
    }

    get moveWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getMoveWindowFlag'];
    }

    get inputWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getInputWindowFlag'];
    }

    get mainSettingsWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getMainSettingsWindowFlag'];
    }

    get consoleWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getConsoleWindowFlag'];
    }

    get profilesWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getProfilesWindowFlag'];
    }

    get selectListWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getSelectListWindowFlag'];
    }

    get preprintingWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getPreprintingWindowFlag']
    }

    get printingWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getPrintingWindowFlag']
    }

    get gorelkaMaintenanceWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getGorelkaMaintenanceWindowFlag']
    }

    get systemInfoWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getSystemInfoWindowFlag']
    }

    get printSettingsFLag() {
        return this.$store.getters['ourExtension/windowFlags/getPrintSettingsWindowFlag']
    }

    get actualTime(): string {
        return this.$store.getters['ourExtension/layoutsData/baseLayout/getActualTime']();
    }

    get isFilesLoadingFinished(): boolean {
        return this.$store.getters['ourExtension/files/getFilesLoadingFinishedFlag']
    }

    get alertFlag(): boolean {
        return this.$store.getters['ourExtension/layoutsData/alerts/getAlertFlag']()
    }

    get infoAlertFlag(): boolean {
        return this.$store.getters['ourExtension/layoutsData/alerts/getInfoAlertFlag']()
    }

    get warningFlag(): boolean {
        return !this.klippyReady || !this.klippyConnected
    }

    disableButton(name: string) {
        if (name in this.buttonFlags) {
            const costyl = this.buttonFlags as any
            costyl[name] = false
        }
    }

    blockingHandler() {
        this.buttonFlags.settingsButton = true

        this.blockingTimeout = setTimeout(() => {
            this.handleScreenBlocking()
        }, 1000)
        setTimeout(() => {
            if (!this.blockingTimeout) {
                this.openMainSettingsWindow()
            }
        }, 100)
    }

    blockingRejector() {
        this.disableButton('settingsButton')
        if (this.blockingTimeout) {
            clearTimeout(this.blockingTimeout)
            this.blockingTimeout = null
        }
    }

    handleScreenBlocking() {
        this.isBlocking = !this.isBlocking
        if (this.isBlocking) {
            const alert: InfoAlertType = {
                message: `<span>Экран заблокирован. Для разблокировки удерживайте кнопку настроек в течение 1 секунды</span>
                <style>
                .info-alert span {
                    text-align: center;
                }
                </style>`,
                type: 'green'
            }
            Alerts.showInfoAlert(alert)
        } else {
            const alert: InfoAlertType = {
                message: 'Экран разблокирован',
                time: 1500,
                type: 'green'
            }
            Alerts.showInfoAlert(alert)
        }
    }

    warningClickHandler() {
        const message = this.klippyStateMessage + '<style>.message-holder {text-align:start !important;}</style>'
        const alert: AlertType = {
            message: message,
            type: 'ok',
            header: 'ОШИБКА!'
        }
        this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
    }

    @Watch('isFilesLoadingFinished', { deep: true })
    isFilesLoadingFinishedWather() {
        if (this.isFilesLoadingFinished) {
            const filesMap: FileSystem = this.$store.getters['ourExtension/files/getFilesMap']
            if (filesMap) {
                filesMap.gcodes.forEach((value) => {
                    this.parseGcodes(value)
                })
            }
        }
    }

    get isProfilesDownloadingFinished(): Boolean {
        return this.$store.getters['ourExtension/files/getProfilesDownloadingFinishedFlag']
    }

    get fatalErrorFlag(): Boolean {
        return !this.klippyReady || !this.klippyConnected
    }

    @Watch('isProfilesDownloadingFinished', { deep: true })
    isProfilesDownloadingFinishedWather() {
        if (this.isProfilesDownloadingFinished) {
            const directoryData: DirectoryData = this.$store.getters['ourExtension/files/getProfilesFiles']
            if (directoryData) {
                const profilesList: Profile[] = []
                const promiseList = []
                for (const file of directoryData.files) {
                    const response = this.getFile(file.name, 'config' + '/' + file.dirnameForMoonraker);
                    let promise = response.then((responseData) => { this.handleProfileResponse(responseData, profilesList) })
                    promiseList.push(promise)
                }
                Promise.all(promiseList).then(() => { this.$store.dispatch('ourExtension/profiles/setProfiles', profilesList) })
            }
        }
    }

    handleProfileResponse(response: AxiosResponse<any, any>, profilesList: Profile[]) {
        if (response.status === 200) {
            const content = response.data;
            if (isSatisfiesProfileType(content)) {
                profilesList.push(content)
            } else if (isSatisfiesProfilesMetadataType(content)) {
                this.$store.commit('ourExtension/profiles/setProfilesMetadata', content)
            }
        }
    }

    mounted() {
        this.$store.dispatch('ourExtension/layoutsData/baseLayout/startTimeRefreshing');
        setTimeout(() => {
            if (this.printerPrinting || this.printerPaused) {
                const alert: AlertType = {
                    message: 'Принтер уже печатает. Открыто окно текущей печати',
                    type: 'ok'
                }
                this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
                this.openExisitingPrintingWindow()
            }
        }, 1000)

    }

    starClick() {
        this.buttonFlags.starButton = true
        // if (this.printingWindowFlag) {
        //     this.printerIsPrintingAlert('', true)
        //     return
        // }
        if (this.isBlocking) {
            this.screenIsBlockingAlert()
            return
        }
        this.openProfilesWindow()
    }

    openProfilesWindow() {
        // this.$store.dispatch('ourExtension/windowFlags/clearStack')
        if (this.profilesWindowFlag) {
            this.openPreviousWindow()
            this.buttonFlags.backButton = false
            setTimeout(() => {
                this.$store.dispatch('ourExtension/layoutsData/profilesWindow/reset')
                this.$store.dispatch('ourExtension/layoutsData/profilesWindow/initWithGlobalProfiles')
                this.$store.dispatch('ourExtension/windowFlags/openProfilesWindow')
            }, 1);
        } else {
            this.$store.dispatch('ourExtension/layoutsData/profilesWindow/reset')
            this.$store.dispatch('ourExtension/layoutsData/profilesWindow/initWithGlobalProfiles')
            this.$store.dispatch('ourExtension/windowFlags/openProfilesWindow')
        }
    }

    openPreviousWindow() {
        this.buttonFlags.backButton = true

        if (this.isBlocking) {
            this.screenIsBlockingAlert()
            return
        }

        if (this.consoleWindowFlag) {
            this.backClickForConsole = true
            return
        }

        if (this.printingWindowFlag && !this.inputWindowFlag && !this.printSettingsFLag && !this.selectListWindowFlag) {
            // this.printerIsPrintingAlert('ourExtension/windowFlags/openPreviousWindow')
            if (this.printerPrinting || this.printerPaused) {
                return
            }
        }
        this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow');
    }

    openMainWindow() {
        this.buttonFlags.mainButton = true
        // if (this.printingWindowFlag) {
        //     this.printerIsPrintingAlert('ourExtension/windowFlags/openMainWindow')
        //     return
        // }

        if (this.isBlocking) {
            this.screenIsBlockingAlert()
            return
        }

        if (this.printerPrinting || this.printerPaused) {
            this.openExisitingPrintingWindow()
            return
        } else {
            this.$store.dispatch('ourExtension/windowFlags/openMainWindow');
        }
    }

    openMoveWindow() {
        this.buttonFlags.moveButton = true

        // if (this.printingWindowFlag) {
        //     this.printerIsPrintingAlert('ourExtension/windowFlags/openMoveWindow')
        //     return
        // }

        if (this.isBlocking) {
            this.screenIsBlockingAlert()
            return
        }
        if (!this.moveWindowFlag) {
            this.$store.dispatch('ourExtension/windowFlags/openMoveWindow');
        }
    }

    openMainSettingsWindow() {
        // if (this.printingWindowFlag) {
        //     this.printerIsPrintingAlert('ourExtension/windowFlags/openMainSettingsWindow')
        //     return
        // }

        if (this.isBlocking) {
            this.screenIsBlockingAlert()
            return
        }
        if (!this.mainSettingsWindowFlag) {
            this.$store.dispatch('ourExtension/windowFlags/openMainSettingsWindow');
        }
    }

    printerIsPrintingAlert(dispatch: string, isItStarClick = false) {
        let callback = this.cancelPrintAndApplyDispatch.bind(this, dispatch)
        let alert: AlertType;
        if (isItStarClick) {
            callback = this.cancelPrintAndOpenProfilesWindow.bind(this)
        } else {
            callback = this.cancelPrintAndApplyDispatch.bind(this, dispatch)
        }
        alert = {
            header: 'ВНИМАНИЕ!',
            message: 'Принтер печатает/готовится печатать. Отменить печать?',
            type: 'yes_no',
            confirmCallback: callback
        }
        this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)

    }

    cancelPrintAndApplyDispatch(dispatch: string) {
        this.cancelPrint()
        this.$store.dispatch(dispatch);
    }

    cancelPrintAndOpenProfilesWindow() {
        this.cancelPrint()
        this.openProfilesWindow()
    }

    cancelPrint() {
        this.cancelPrintAlert()
        SocketActions.printerPrintCancel()
        this.addConsoleEntry('CANCEL_PRINT')
    }

    cancelPrintAlert() {
        const alert: InfoAlertType = {
            message: `Запрошена отмена печати`,
            type: 'red'
        }
        Alerts.showInfoAlert(alert)
    }

    async parseGcodes(file: FileData) {
        this.getGcode(file)
            .then(response => response?.data)
            .then((gcode) => {
                const [layers, buildTime] = parseGcode(gcode)
                file.layers = layers;
                file.printingTime = buildTime;
            })
            .catch(e => e)
            .finally(() => {
                this.$store.dispatch('files/removeFileDownload')
            })
    }

}
</script>

<style lang="scss">
@import '@/style/baseLayout/css/base_layout.scss';
</style>
