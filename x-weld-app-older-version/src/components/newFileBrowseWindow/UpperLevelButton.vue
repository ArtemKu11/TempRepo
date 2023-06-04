<template>
    <div class="wrapper">
        <button @click="clickHandler" class="upper-folder-button">
            <div class="info-holder">
                <img src="@/layouts/main_window_layout/img/upper_folder_fix.svg">
                <span>На уровень выше</span>
            </div>
        </button>
        <hr />
    </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class UpperLevelButton extends Vue {

    get currentPath(): string {
        return this.$store.getters['ourExtension/layoutsData/newFileBrowseWindow/getCurrentPath']
    }

    clickHandler() {
        this.$store.commit('ourExtension/layoutsData/newFileBrowseWindow/deactivateFiles');
        const lastSlash = this.currentPath.lastIndexOf('/')
        if (lastSlash != -1) {
            const newPath = this.currentPath.slice(0, lastSlash)
            this.$store.dispatch('ourExtension/layoutsData/newFileBrowseWindow/setCurrentPath', newPath);
        }
    }
}
</script>

<style lang="scss">
.upper-folder-button:active {
    .info-holder {
        span {
            color: white !important;
        }
    }
}
</style>