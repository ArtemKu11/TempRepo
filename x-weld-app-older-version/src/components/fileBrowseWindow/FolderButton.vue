<template>
    <div class="wrapper">
        <button @click="clickHandler" class="folder-button active">
            <div class="info-holder">
                <img src="@/layouts/main_window_layout/img/folder.png">
                <span>{{ directoryData.name }}</span>
                <div class="file-info">
                    <span>Дата: {{ directoryData.date }}</span>
                    <span>Размер: {{ directoryData.size }}kb</span>
                    <span>Время печати: 15h 21m</span>
                </div>
            </div>
        </button>
        <hr />
    </div>
</template>


<script lang="ts">
import { DirectoryData } from '@/store/ourExtension/layoutsData/fileBrowseWindow/types';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class FolderButton extends Vue {
    @Prop()
    directoryData!: DirectoryData

    clickHandler() {
        this.$store.commit('ourExtension/layoutsData/fileBrowseWindow/deactivateFiles');
        this.$store.dispatch('ourExtension/layoutsData/fileBrowseWindow/openDirectory', this.directoryData);
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