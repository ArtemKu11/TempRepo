<template>
    <div @contextmenu.prevent="" id="app-child">
        <router-view></router-view>
        <DefaultAlert v-if="alertFlag" />
        <InfoAlert v-if="infoAlertFlag" />
        <!-- <FatalErrorAlert v-if="fatalErrorFlag" /> -->
    </div>
</template>

<script lang="ts">
// В ЭТОЙ ВЕТКЕ НЕ НУЖНО И ОТКЛЮЧЕНО НА УРОВНЕ 1 ШАГА
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


import { Component, Mixins, Watch } from 'vue-property-decorator';

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
import { AlertType } from './store/ourExtension/layoutsData/alerts/types';
import WindowsMixin from './mixins/windows';
import GpioMixin from './mixins/gpio';
import { Alerts } from './store/ourExtension/layoutsData/alerts/helpers';

@Component({
    components: {
        DefaultAlert, InfoAlert, FatalErrorAlert
    },
})
export default class App extends Mixins(FilesMixin, StateMixin, WindowsMixin, GpioMixin) {

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

    get osc(): boolean {
        return this.$store.getters['ourExtension/temp/oscillationWindowFlag']
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

    get isProfilesDownloadingFinished(): Boolean {
        return this.$store.getters['ourExtension/files/getProfilesDownloadingFinishedFlag']
    }

    get fatalErrorFlag(): Boolean {
        return !this.klippyReady || !this.klippyConnected
    }

    @Watch('gpioSocketConnected')
    gpioSocketConnectedWather() {
        if (this.gpioSocketConnected) {
            const alert: AlertType = {
                message: "GPIO сокет подключен!",
                type: 'green'
            }
            Alerts.showInfoAlert(alert)
        } else {
            const alert: AlertType = {
                message: "GPIO сокет умер!",
                type: 'red'
            }
            Alerts.showInfoAlert(alert)
        }
    }

    mounted() {
        this.$store.dispatch('ourExtension/layoutsData/baseLayout/startTimeRefreshing');
        // setTimeout(() => {
        //     if (this.printerPrinting || this.printerPaused) {
        //         const alert: AlertType = {
        //             message: 'Принтер уже печатает. Открыто окно текущей печати',
        //             type: 'ok'
        //         }
        //         this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
        //         this.initExisitingPrintingWindow()
        //     }
        // }, 1000)

    }

    // @Watch("printerPrinting")
    // printerPrintingWather() {
    //     if (this.printerPrinting) {
    //         setTimeout(() => {
    //             if ((this.printerPrinting || this.printerPaused) && this.$route.path !== '/print') {
    //                 this.initExisitingPrintingWindow()
    //                 this.$router.push('/print')
    //             }
    //         }, 2000)
    //     }
    // }

    // @Watch('isFilesLoadingFinished', { deep: true })
    // isFilesLoadingFinishedWather() {
    //     if (this.isFilesLoadingFinished) {
    //         const filesMap: FileSystem = this.$store.getters['ourExtension/files/getFilesMap']
    //         if (filesMap) {
    //             filesMap.gcodes.forEach((value) => {
    //                 this.parseGcodes(value)
    //             })
    //             this.$store.dispatch('ourExtension/layoutsData/newFileBrowseWindow/setCurrentPath', 'gcodes')
    //         }
    //     }
    // }

    // @Watch('isProfilesDownloadingFinished', { deep: true })
    // isProfilesDownloadingFinishedWather() {
    //     if (this.isProfilesDownloadingFinished) {
    //         const directoryData: DirectoryData = this.$store.getters['ourExtension/files/getProfilesFiles']
    //         if (directoryData) {
    //             const profilesList: Profile[] = []
    //             const promiseList = []
    //             for (const file of directoryData.files) {
    //                 const response = this.getFile(file.name, 'config' + '/' + file.dirnameForMoonraker);
    //                 let promise = response.then((responseData) => { this.handleProfileResponse(responseData, profilesList) })
    //                 promiseList.push(promise)
    //             }
    //             Promise.all(promiseList).then(() => { this.$store.dispatch('ourExtension/profiles/setProfiles', profilesList) })
    //         }
    //     }
    // }

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

    disableButton(name: string) {
        if (name in this.buttonFlags) {
            const costyl = this.buttonFlags as any
            costyl[name] = false
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

}
</script>

<style lang="scss">
@import '@/style/baseLayout/css/base_layout.scss';
</style>
