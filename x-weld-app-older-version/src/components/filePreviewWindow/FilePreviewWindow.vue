<template>
    <div class="content-container open-file-layout">
        <div id="content-header"><img src="@/layouts/open_file_layout/img/xweld_logo.png"></div>
        <div id="content-center">
            <img src="@/layouts/open_file_layout/img/printing_file_icon.png">
            <div id="file-info-holder">
                <!-- <span>3D_Printer_test_fixed_stl_3rd_gen...</span>
                <span>Время печати: 15h 21m</span>
                <span>Количество слоев: 3415</span>
                <span>Размер файла: 32,128,476 байт</span> -->
                <span>{{ fileData.name }}</span>
                <span>Время печати: {{ fileData.printingTime }}</span>
                <span>Количество слоев: {{ fileData.layers }}</span>
                <span>Размер файла: {{ fileData.sizeInKb }}kb</span>
            </div>
        </div>
        <div id="content-footer">
            <div class="one-button-wrapper">
                <button @click="openPreviousWindow"><img src="@/layouts/open_file_layout/img/open_icon.png"><span>Открыть</span></button>
            </div>
            <div class="two-buttons-wrapper">
                <button><img src="@/layouts/open_file_layout/img/move_icon.png"><span>Перемещение</span></button>
                <button @click="openProfilesWindow"><img src="@/layouts/open_file_layout/img/profiles_icon.png"><span>Профили</span></button>
            </div>
            <div class="one-button-wrapper">
                <button><img src="@/layouts/open_file_layout/img/print_icon.png"><span>Печать</span></button>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { FileData } from '@/store/ourExtension/files/types';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class FilePreviewWindow extends Vue {
    get fileData(): FileData {
        return this.$store.getters['ourExtension/layoutsData/filePreviewWindow/getFileData']()
    }

    openProfilesWindow() {
        this.$store.dispatch('ourExtension/layoutsData/profilesWindow/reset')
        this.$store.dispatch('ourExtension/layoutsData/profilesWindow/setFile', this.fileData)
        this.$store.dispatch('ourExtension/windowFlags/openProfilesWindow')    
    }

    openPreviousWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow')
    }
}
</script>


<style lang="scss">
@import '@/layouts/open_file_layout/css/open_file_layout.scss';
</style>