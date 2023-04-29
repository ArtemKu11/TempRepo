<template>
    <div ref="mainContainer" class="material-select-container">
        <div class="material-select-content-container">
            <div class="material-select-header">
                <button @click="homeButtonClick" class="home-button"><img
                        src="@/layouts/profiles_layout/img/button_star.svg"></button>
                <button class="points-button"><img src="@/layouts/profiles_layout/img/points_icon.png"></button>
            </div>
            <div class="material-select-center">
                <ItemButton @selectItem="selectItem" @activateItem="activateItem" @deactivateItems="deactivateItems" v-for="(item, index) of listItems" :key="index"
                    :listInstance="item" />
            </div>
            <div class="file-select-footer"></div>
        </div>
    </div>
</template>


<script lang="ts">
import { ListInstance } from '@/store/ourExtension/layoutsData/selectListWindow/types';
import { Vue, Component, Prop } from 'vue-property-decorator';
import ItemButton from './ItemButton.vue';

@Component({
    components: {
        ItemButton
    },
})
export default class FatalSelectList extends Vue {

    @Prop()
    items!: string[]
    listItems: ListInstance[] = []

    mounted() {
        const container = this.$refs.mainContainer as HTMLElement;
        if (container) {
            container.style.zIndex = '10'
        }

        for (const item of this.items) {
            this.listItems.push({
                isActive: false,
                name: item
            })
        }
    }

    deactivateItems() {
        for (const item of this.listItems) {
            item.isActive = false
        }
    }

    activateItem(itemProp: string) {
        for (const item of this.listItems) {
            if (itemProp === item.name.toLowerCase()) {
                item.isActive = true
            }
        }
    }

    homeButtonClick() {
        this.$emit('close')
    }

    selectItem(itemName: string) {
        this.$emit('selectItem', itemName)
    }
}
</script>

<style>
button {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-tap-highlight-color: transparent;
}
</style>