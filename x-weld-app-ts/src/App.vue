<template>
    <div id="sidebar">
        <div id="sidebar-time-holder">12:39</div>
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
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import FileBrowseWindow from '@/components/fileBrowseWindow/FileBrowseWindow.vue';
import MainWindow from '@/components/mainWindow/MainWindow.vue';
import FilePreviewWindow from '@/components/filePreviewWindow/FilePreviewWindow.vue';

@Options({
    components: {
        MainWindow, FileBrowseWindow, FilePreviewWindow
    },
})
export default class App extends Vue {
    get mainWindowFlag(): boolean {
        return this.$store.getters['windowFlags/getMainWindowFlag']
    }

    get fileBrowseWindowFlag(): boolean {
        return this.$store.getters['windowFlags/getFileBrowseWindowFlag']
    }

    get filePreviewWindowFlag(): boolean {
        return this.$store.getters['windowFlags/getFilePreviewWindowFlag']
    }

    openPreviousWindow() {
        this.$store.dispatch('windowFlags/openPreviousWindow');
    }

    openMainWindow() {
        this.$store.dispatch('windowFlags/openMainWindow');
    }
 }
</script>

