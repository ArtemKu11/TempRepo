<template>
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
</template>


<script lang="ts">
import { FileData } from '@/store/layoutsData/fileBrowseWindow/types';
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';


export default class FileButton extends Vue {
    @Prop()
    fileData: FileData

    chooseFile() {
        this.$store.commit('layoutsData/fileBrowseWindow/chooseFile', this.fileData.fileId);
    }

    openChosenFile() {
        this.$store.commit('layoutsData/filePreviewWindow/setFileData', this.fileData);
        this.$store.dispatch('windowFlags/openFilePreviewWindow');
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
