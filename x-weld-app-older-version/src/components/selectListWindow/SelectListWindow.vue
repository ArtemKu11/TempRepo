<template>
    <div id="material-select-container">
        <div id="material-select-content-container">
            <div id="material-select-header">
                <button @click="homeButtonClick" id="home-button"><img src="@/layouts/profiles_layout/img/button_star.svg"></button>
                <button id="points-button"><img src="@/layouts/profiles_layout/img/points_icon.png"></button>
            </div>
            <div id="material-select-center">
                <ItemButton v-for="(item, index) of listItems" :key="index" :listInstance="item" />
            </div>
            <div id="file-select-footer"></div>
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

    homeButtonClick() {
        this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow')
    }
}
</script>
