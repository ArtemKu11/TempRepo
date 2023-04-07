<template>
    <div id="app-child">
        <div id="sidebar">
            <div id="sidebar-time-holder">{{ actualTime }}</div>
            <div id="sidebar-button-holder">
                <button @click="openMainWindow" class="sidebar-button menu"></button>
                <button class="sidebar-button move"></button>
                <button class="sidebar-button star"></button>
                <button class="sidebar-button settings"></button>
                <button @click="openPreviousWindow" class="sidebar-button back"></button>
            </div>
            <div id="sidebar-footer"></div>
        </div>
        <MainWindow v-if="mainWindowFlag" />
        <FileBrowseWindow v-if="fileBrowseWindowFlag" />
        <FilePreviewWindow v-if="filePreviewWindowFlag" />

    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FileBrowseWindow from './components/fileBrowseWindow/FileBrowseWindow.vue';
import FilePreviewWindow from './components/filePreviewWindow/FilePreviewWindow.vue';
import MainWindow from './components/mainWindow/MainWindow.vue';

@Component({
    components: {
        MainWindow, FileBrowseWindow, FilePreviewWindow
    },
})
export default class App extends Vue {
    get mainWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getMainWindowFlag']
    }

    get fileBrowseWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getFileBrowseWindowFlag']
    }

    get filePreviewWindowFlag(): boolean {
        return this.$store.getters['ourExtension/windowFlags/getFilePreviewWindowFlag']
    }

    get actualTime(): string {
        return this.$store.getters['ourExtension/layoutsData/baseLayout/getActualTime']()
    }

    mounted() {
        this.$store.dispatch('ourExtension/layoutsData/baseLayout/startTimeRefreshing')
    }

    openPreviousWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow');
    }

    openMainWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openMainWindow');
    }
}
</script>

<style lang="scss">
@import '@/layouts/base_layout/css/base_layout.scss'
</style>
