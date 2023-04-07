<template>
<div id="file-select-container">
        <div id="file-select-content-container">
            <div id="file-select-header">
                <button @click="openMainWindow" id="home-button"><img
                        src="@/layouts/main_window_layout/img/home_icon.png"></button>
                <button id="models-for-print-button">Модели для печати</button>
                <button id="points-button"><img src="@/layouts/main_window_layout/img/points_icon.png"></button>
            </div>
            <div id="file-select-center">

                <UpperLevelButton />
                <FileButton v-for="fileData of fileList" :key="fileData.fileId" :fileData="fileData"/>
            </div>
            <div id="file-select-footer"></div>
        </div>
    </div>
</template>


<script lang="ts">
import { FileData } from '@/store/ourExtension/layoutsData/fileBrowseWindow/types';
import { Component, Prop, Vue } from 'vue-property-decorator';
import FileButton from './FileButton.vue';
import UpperLevelButton from './UpperLevelButton.vue';



@Component({
    components: {
        UpperLevelButton, FileButton
    },
})
export default class FileBrowseWindow extends Vue {
    get fileList(): Array<FileData> {
        return this.$store.getters['ourExtension/layoutsData/fileBrowseWindow/getListOfFiles']
    }

    mounted(): void {
        this.$store.commit('ourExtension/layoutsData/fileBrowseWindow/deactivateFiles')
    }

    openMainWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openMainWindow');
    }
}
</script>