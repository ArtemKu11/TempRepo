<template>
    <div class="wrapper">
        <div class="file-button" :class="{ active: fileData.isActive }" @click="chooseFile">
            <div class="info-holder">
                <img src="@/layouts/main_window_layout/img/disabled_checkbox.png">
                <span>{{ fileData.name }}</span>
                <div class="file-info">
                    <span>Дата: {{ fileData.date }}</span>
                    <span>Размер: {{ fileData.size }}kb</span>
                    <span>Время печати: 15h 21m</span>
                </div>
            </div>
            <button @click="openChosenFile">Открыть</button>
        </div>
        <hr />
    </div>
</template>


<script lang="ts">
import { FileData } from '@/store/ourExtension/layoutsData/fileBrowseWindow/types';
import { Prop, Vue, Component } from 'vue-property-decorator';


@Component({})
export default class FileButton extends Vue {
    @Prop()
    fileData!: FileData

    chooseFile() {
        this.$store.commit('ourExtension/layoutsData/fileBrowseWindow/chooseFile', this.fileData.fileId);
    }

    openChosenFile() {
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
