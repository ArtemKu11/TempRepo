<template>
    <div class="button-wrapper">
        <div @click="firstClickHandler" class="material-select-button" :class="{ 'active': listInstance.isActive }">
            <div class="material-info">
                <div v-if="isItIconImplementation" class="material-icon">{{ listInstance.icon }}</div>
                <span>{{ listInstance.name }}</span>
            </div>
            <button @click="confirmClickHandler" class="select-material-button">Выбрать</button>
        </div>
        <hr>
    </div>
</template>


<script lang="ts">
import { ListInstance } from '@/store/ourExtension/layoutsData/selectListWindow/types';
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class ItemButton extends Vue {
    @Prop()
    listInstance!: ListInstance;

    get isItIconImplementation() {
        return this.$store.getters['ourExtension/layoutsData/selectListWindow/isItIconImplementation']
    }

    firstClickHandler() {
        if (this.listInstance.isActive) {
            this.listInstance.isActive = false
        } else {
            this.$store.dispatch('ourExtension/layoutsData/selectListWindow/deactivateItems')
            this.listInstance.isActive = true
        }
    }

    confirmClickHandler() {
        this.$store.dispatch('ourExtension/layoutsData/selectListWindow/confirm', this.listInstance.name)
    }
}
</script>


<style lang="scss">
</style>