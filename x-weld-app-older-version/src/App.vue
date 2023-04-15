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
            <div id="sidebar-footer"></div>
        </div>

        <MainWindow v-if="mainWindowFlag" />
        <FileBrowseWindow v-if="fileBrowseWindowFlag" />
        <FilePreviewWindow v-if="filePreviewWindowFlag" />
        <MoveWindow v-if="moveWindowFlag" />
        <InputWindow v-if="inputWindowFlag" />
        <MainSettingsWindow v-if="mainSettingsWindowFlag" />
        <ConsoleWindow v-if="consoleWindowFlag" />

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
import { FileData, FileSystem } from './store/ourExtension/files/types';
import FilesMixin from './mixins/files';
import { parseGcode } from './workers/xWeldParser';

@Component({
    components: {
        MainWindow, FileBrowseWindow, FilePreviewWindow, MoveWindow, InputWindow, MainSettingsWindow, ConsoleWindow
    },
})
export default class App extends Mixins(FilesMixin) {
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

    get actualTime(): string {
        return this.$store.getters['ourExtension/layoutsData/baseLayout/getActualTime']();
    }

    get isFilesLoadingFinished(): boolean {
        return this.$store.getters['ourExtension/files/getFilesLoadingFinishedFlag']
    }

    @Watch('isFilesLoadingFinished', {deep: true})
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

    mounted() {
        this.$store.dispatch('ourExtension/layoutsData/baseLayout/startTimeRefreshing');
    }

    starClick() {
        this.$store.dispatch('ourExtension/files/setLayersByMoonrakerPath', { path: 'hexagon.gcode', layers: '20' })
        console.log(this.$store.state.ourExtension.files)
        console.log(this.$store.state.ourExtension.files.fileSystem)

        console.log(this.$store.state.ourExtension.layoutsData.newFileBrowseWindow)
        console.log(this.$store.getters['ourExtension/layoutsData/newFileBrowseWindow/getSelectedFile'])
        console.log(this.$store.state.files)
    }

    openPreviousWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow');
    }

    openMainWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openMainWindow');
    }

    openMoveWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openMoveWindow');
    }

    openMainSettingsWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openMainSettingsWindow');
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
