<template>
    <div @contextmenu.prevent="" id="app-child">
        <div id="sidebar">
            <div id="sidebar-time-holder">{{ actualTime }}</div>
            <div id="sidebar-button-holder">
                <button @touchstart="openMainWindow" @touchend="disableButton('mainButton')" class="sidebar-button menu"
                    :class="{ 'active': buttonFlags.mainButton }"></button>
                <button @touchstart="openMoveWindow" @touchend="disableButton('moveButton')" class="sidebar-button move"
                    :class="{ 'active': buttonFlags.moveButton }"></button>
                <button @touchstart="starClick" @touchend="disableButton('starButton')" class="sidebar-button star"
                    :class="{ 'active': buttonFlags.starButton }"></button>
                <button @touchstart="blockingHandler" @touchend="blockingRejector"
                    :class="{ 'active': buttonFlags.settingsButton }" class="sidebar-button settings"></button>
                <button @touchstart="openPreviousWindow" @touchend="disableButton('backButton')" class="sidebar-button back"
                    :class="{ 'active': buttonFlags.backButton }"></button>
            </div>
            <div id="sidebar-footer">
                <!-- <span v-if="warningFlag" @click="warningClickHandler">WARN</span> -->
            </div>
        </div>

        <MainWindow v-if="mainWindowFlag" />
        <FileBrowseWindow v-if="fileBrowseWindowFlag" />
        <FilePreviewWindow v-if="filePreviewWindowFlag" />
        <MoveWindow v-if="moveWindowFlag" />
        <InputWindow v-if="inputWindowFlag" />
        <MainSettingsWindow v-if="mainSettingsWindowFlag" />
        <ConsoleWindow v-if="consoleWindowFlag" />
        <ProfilesWindow v-if="profilesWindowFlag" />
        <SelectListWindow v-if="selectListWindowFlag" />
        <PreprintingWindow v-if="preprintingWindowFlag" />
        <PrintingWindow v-if="printingWindowFlag" />
        <GorelkaMaintenanceWindow v-if="gorelkaMaintenanceWindowFlag" />
        <SystemInfoWindow v-if="systemInfoWindowFlag" />
        <DefaultAlert v-if="alertFlag" />
        <InfoAlert v-if="infoAlertFlag" />
        <BlockingWindow v-if="isBlocking" />
        <FatalErrorAlert v-if="fatalErrorFlag" />

    </div>
</template>

<script lang="ts">

import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
import FileBrowseWindow from './components/newFileBrowseWindow/FileBrowseWindow.vue';
import FilePreviewWindow from './components/filePreviewWindow/FilePreviewWindow.vue';
import MainWindow from './components/mainWindow/MainWindow.vue';
import MoveWindow from './components/moveWindow/MoveWindow.vue';
import InputWindow from './components/inputWindow/InputWindow.vue';
import MainSettingsWindow from './components/mainSettingsWindow/MainSettingsWindow.vue'
import ConsoleWindow from './components/consoleWindow/ConsoleWindow.vue';
import ProfilesWindow from './components/profilesWindow/ProfilesWindow.vue';
import SelectListWindow from './components/selectListWindow/SelectListWindow.vue';
import PreprintingWindow from './components/preprintingWindow/PreprintingWindow.vue';
import PrintingWindow from './components/printingWindow/NewPrintingWindow.vue';

import GorelkaMaintenanceWindow from './components/gorelkaMaintenanceWindow/GorelkaMaintenanceWindow.vue';
import SystemInfoWindow from './components/systemInfoWindow/SystemInfoWindow.vue';
import DefaultAlert from './components/alerts/DefaultAluert.vue';
import InfoAlert from './components/alerts/InfoAlert.vue';
import FatalErrorAlert from '@/components/alerts/FatalErrorAlert.vue'
import BlockingWindow from './components/blockingWindow/BlockingWindow.vue';
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
        MainWindow, FileBrowseWindow, FilePreviewWindow, MoveWindow, InputWindow, MainSettingsWindow, ConsoleWindow,
        ProfilesWindow, SelectListWindow, PreprintingWindow, PrintingWindow, DefaultAlert, InfoAlert,
        GorelkaMaintenanceWindow, SystemInfoWindow, FatalErrorAlert, BlockingWindow
    },
})
export default class App extends Mixins(FilesMixin, StateMixin, WindowsMixin) {
    isBlocking = false
    blockingTime = 0
    blockingTimeout: null | number = null
    // backClickForConsole = false

    buttonFlags = {
        mainButton: false,
        moveButton: false,
        starButton: false,
        settingsButton: false,
        backButton: false
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
            this.$store.dispatch('ourExtension/layoutsData/settingsWindow/setBackClickFlagForConsole', true)
            // this.backClickForConsole = true
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
@import '@/layouts/base_layout/css/base_layout.scss';
</style>
