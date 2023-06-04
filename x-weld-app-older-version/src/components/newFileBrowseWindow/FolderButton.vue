<template>
    <div class="wrapper">
        <button @click="clickHandler" class="folder-button active">
            <div class="info-holder">
                <img src="@/layouts/main_window_layout/img/folder_fix.svg">
                <span>{{ directoryData.name }}</span>
                <div class="file-info">
                    <span>Дата: {{ directoryData.modified }}</span>
                    <!-- <span>Размер: {{ directoryData.sizeInKb }}kb</span> -->
                    <span>Размер: {{ directoryData.computedSize }}</span>
                </div>
            </div>
        </button>
        <hr />
    </div>
</template>


<script lang="ts">
import { DirectoryData } from '@/store/ourExtension/files/types';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class FolderButton extends Vue {
    @Prop()
    directoryData!: DirectoryData

    get currentPath() {
        return this.$store.getters['ourExtension/layoutsData/newFileBrowseWindow/getCurrentPath']
    }

    clickHandler() {
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
        const newPath = this.currentPath + "/" + this.directoryData.name
        this.$store.dispatch('ourExtension/layoutsData/newFileBrowseWindow/setCurrentPath', newPath);
    }
}
</script>

<style lang="scss">
.folder-button:active {
    .info-holder {
        span {
            color: white !important;
        }
    }

}
</style>