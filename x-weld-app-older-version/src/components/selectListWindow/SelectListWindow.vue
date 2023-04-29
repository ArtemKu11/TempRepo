<template>
    <div ref="mainContainer" class="material-select-container">
        <div class="material-select-content-container">
            <div class="material-select-header">
                <button @click="homeButtonClick" class="home-button"><img
                        src="@/layouts/profiles_layout/img/button_star.svg"></button>
                <button class="points-button"><img src="@/layouts/profiles_layout/img/points_icon.png"></button>
            </div>
            <div class="material-select-center">
                <ItemButton v-for="(item, index) of listItems" :key="index" :listInstance="item" />
            </div>
            <div class="file-select-footer"></div>
        </div>
    </div>
</template>


<script lang="ts">
import { ListInstance } from '@/store/ourExtension/layoutsData/selectListWindow/types';
import { Vue, Component } from 'vue-property-decorator';
import ItemButton from './ItemButton.vue';

@Component({
    components: {
        ItemButton
    },
})
export default class SelectListWindow extends Vue {
    get listItems(): ListInstance[] {
        return this.$store.getters['ourExtension/layoutsData/selectListWindow/getListItems']
    }

    get zIndex() {
        return this.$store.getters['ourExtension/layoutsData/selectListWindow/getZIndex']
    }

    mounted() {
        if (this.zIndex) {
            const container = this.$refs.mainContainer as HTMLElement
            if (container) {
                container.style.zIndex = this.zIndex
            }
        }
    }

    homeButtonClick() {
        this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow')
    }
}
</script>

<style>
button {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-tap-highlight-color: transparent;
}
</style>