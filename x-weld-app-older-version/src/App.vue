<template>
    <div @contextmenu.prevent="" id="app-child">
        <div id="sidebar">
            <div id="sidebar-time-holder">{{ actualTime }}</div>
            <div id="sidebar-button-holder">
                <button @click="openMainWindow" class="sidebar-button menu"></button>
                <button @click="openMoveWindow" class="sidebar-button move"></button>
                <button @click="starClick" class="sidebar-button star"></button>
                <button @click="openMainSettingsWindow" class="sidebar-button settings"></button>
                <button @click="openPreviousWindow" class="sidebar-button back"></button>
            </div>
            <div id="sidebar-footer">
                <span v-if="warningFlag" @click="warningClickHandler">WARN</span>
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

    </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
// import FileBrowseWindow from './components/fileBrowseWindow/FileBrowseWindow.vue';
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
import PrintingWindow from './components/printingWindow/PrintingWindow.vue';
import GorelkaMaintenanceWindow from './components/gorelkaMaintenanceWindow/GorelkaMaintenanceWindow.vue';
import SystemInfoWindow from './components/systemInfoWindow/SystemInfoWindow.vue';
import DefaultAlert from './components/alerts/DefaultAluert.vue';
import InfoAlert from './components/alerts/InfoAlert.vue';
import { FileData, FileSystem, DirectoryData } from './store/ourExtension/files/types';
import FilesMixin from './mixins/files';
import { parseGcode } from './workers/xWeldParser';
import { Profile } from './store/ourExtension/profiles/types'
import { isSatisfiesProfilesMetadataType, isSatisfiesProfileType } from './store/ourExtension/profiles/helpers';
import { AxiosResponse } from 'axios';
import StateMixin from './mixins/state';
import { AlertType } from './store/ourExtension/layoutsData/alerts/types';
import { SocketActions } from './api/socketActions';

@Component({
    components: {
        MainWindow, FileBrowseWindow, FilePreviewWindow, MoveWindow, InputWindow, MainSettingsWindow, ConsoleWindow,
        ProfilesWindow, SelectListWindow, PreprintingWindow, PrintingWindow, DefaultAlert, InfoAlert,
        GorelkaMaintenanceWindow, SystemInfoWindow
    },
})
export default class App extends Mixins(FilesMixin, StateMixin) {
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
            if (!this.klippyReady || !this.klippyConnected) {
                const message = this.klippyStateMessage
                const alert: AlertType = {
                    message: message,
                    type: 'ok',
                    header: 'ОШИБКА!'
                }
                this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
            }
        }, 1000)

    }

    starClick() {
        if (this.printingWindowFlag) {
            this.printerIsPrintingAlert('', true)
            return
        }
        this.openProfilesWindow()
    }

    openProfilesWindow() {
        this.$store.dispatch('ourExtension/windowFlags/clearStack')
        if (this.profilesWindowFlag) {
            this.openPreviousWindow()
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
        if (this.printingWindowFlag && !this.inputWindowFlag && !this.printSettingsFLag) {
            this.printerIsPrintingAlert('ourExtension/windowFlags/openPreviousWindow')
            return
        }
        this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow');
    }

    openMainWindow() {
        if (this.printingWindowFlag) {
            this.printerIsPrintingAlert('ourExtension/windowFlags/openMainWindow')
            return
        }
        this.$store.dispatch('ourExtension/windowFlags/openMainWindow');
    }

    openMoveWindow() {
        if (this.printingWindowFlag) {
            this.printerIsPrintingAlert('ourExtension/windowFlags/openMoveWindow')
            return
        }
        this.$store.dispatch('ourExtension/windowFlags/openMoveWindow');
    }

    openMainSettingsWindow() {
        if (this.printingWindowFlag) {
            this.printerIsPrintingAlert('ourExtension/windowFlags/openMainSettingsWindow')
            return
        }
        this.$store.dispatch('ourExtension/windowFlags/openMainSettingsWindow');
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
        SocketActions.printerPrintCancel()
        this.addConsoleEntry('CANCEL_PRINT')
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
@import '@/layouts/base_layout/css/base_layout.scss'
</style>
