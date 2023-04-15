<template>
    <div class="wrapper">
        <button @click="clickHandler" class="upper-folder-button">
            <div class="info-holder">
                <img src="@/layouts/main_window_layout/img/upper_folder.png">
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
    clickHandler() {
        this.$store.commit('ourExtension/layoutsData/fileBrowseWindow/deactivateFiles');
        this.$store.dispatch('ourExtension/layoutsData/fileBrowseWindow/openPreviousDirectory')
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