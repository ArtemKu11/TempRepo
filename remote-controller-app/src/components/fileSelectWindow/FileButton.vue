<template>
    <button @touchstart="touchStartHandler" :class="{'active': fileData.isSelected }" class="file-union-button">
        <div v-if="fileData.isSelected" class="wrapper">
            <div class="description">
                <img src="@/style/fileSelectWindow/img/big_cube.svg" alt="">
                <span class="name">{{ fileData.name }}</span>
                <div class="meta-info">
                    <span class="date">Дата: {{ fileData.modified }}</span>
                    <span class="size">Размер: {{ fileData.computedSize }}</span>
                    <span class="print-time">Время печати: {{ fileData.printingTime }}</span>
                </div>
            </div>
            <hr>
        </div>
        <div v-else class="wrapper">
            <div class="description">
                <img src="@/style/fileSelectWindow/img/small_cube.svg" alt="">
                <span class="name">{{ fileData.name }}</span>
            </div>
            <hr>
        </div>
    </button>
</template>


<script lang="ts">
import { FileData } from '@/store/ourExtension/files/types';
import { Prop, Component, Vue } from 'vue-property-decorator';


@Component({})
export default class FileButton extends Vue {
    @Prop()
    fileData!: FileData

    chooseFile() {
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
        this.fileData.isSelected = true;
    }

    openChosenFile() {  // TODO убрать
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/setSelectedFile', this.fileData);
        this.$store.commit('ourExtension/layoutsData/filePreviewWindow/setFileData', this.fileData);
        this.$store.dispatch('ourExtension/windowFlags/openFilePreviewWindow');
    }

    touchStartHandler() {
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
        this.fileData.isSelected = true;
    }
}
</script>