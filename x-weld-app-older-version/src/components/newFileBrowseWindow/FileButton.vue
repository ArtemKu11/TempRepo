<template>
    <div class="wrapper">
        <div @click="chooseFile" :class="{active: fileData.isSelected}" class="file-button">
            <div class="info-holder">
                <img src="@/layouts/main_window_layout/img/disabled_checkbox.png">
                <span>{{ fileData.name }}</span>
                <div class="file-info">
                    <span>Дата: {{ fileData.modified }}</span>
                    <!-- <span>Размер: {{ fileData.sizeInKb }}kb</span> -->
                    <span>Размер: {{ fileData.computedSize }}</span>
                    <span>Время печати: {{ fileData.printingTime }}</span>
                </div>
            </div>
            <button @click="openChosenFile">Открыть</button>
        </div>
        <hr />
    </div>
</template>


<script lang="ts">
import { FileData } from '@/store/ourExtension/files/types';
import { Prop, Vue, Component } from 'vue-property-decorator';


@Component({})
export default class FileButton extends Vue {
    @Prop()
    fileData!: FileData

    chooseFile() {
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
        this.fileData.isSelected = true;
    }

    openChosenFile() {
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/setSelectedFile', this.fileData);
        this.$store.commit('ourExtension/layoutsData/filePreviewWindow/setFileData', this.fileData);
        this.$store.dispatch('ourExtension/windowFlags/openFilePreviewWindow');
    }

}
</script>


<style lang="scss">
.file-button.active {
    .info-holder {
        span {
            color: white !important;
        }

        img {
            content: url('@/layouts/main_window_layout/img/checked_checkbox.png');
        }
    }

    button {
        display: block !important;
    }

}
</style>
