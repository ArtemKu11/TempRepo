<template>
    <button @touchstart="touchStartHandler" :class="{'active': directoryData.isSelected }" class="file-union-button">
        <div v-if="directoryData.isSelected" class="wrapper">
            <div class="description">
                <img src="@/style/fileSelectWindow/img/big_cube.svg" alt="">
                <span class="name">{{ directoryData.name }}</span>
                <div class="meta-info">
                    <span class="date">Дата: {{ directoryData.modified }}</span>
                    <span class="size">Размер: {{ directoryData.computedSize }}</span>
                </div>
            </div>
            <hr>
        </div>
        <div v-else class="wrapper">
            <div class="description">
                <img src="@/style/fileSelectWindow/img/folder_button.svg" alt="">
                <span class="name">{{ directoryData.name }}</span>
            </div>
            <hr>
        </div>
    </button>
</template>


<script lang="ts">
import { DirectoryData } from '@/store/ourExtension/files/types';
import { Prop, Component, Vue } from 'vue-property-decorator';


@Component({})
export default class FolderButton extends Vue {
    @Prop()
    directoryData!: DirectoryData

    get currentPath() {
        return this.$store.getters['ourExtension/layoutsData/newFileBrowseWindow/getCurrentPath']
    }

    touchStartHandler() {
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
        this.directoryData.isSelected = true;
    }
}
</script>