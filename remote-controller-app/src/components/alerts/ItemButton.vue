<template>
    <div class="button-wrapper">
        <div @click="firstClickHandler" class="material-select-button" :class="{ 'active': listInstance.isActive }">
            <div class="material-info">
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
    

    firstClickHandler() {
        if (this.listInstance.isActive) {
            this.$emit('deactivateItems')
        } else {
            this.$emit('deactivateItems')
            this.$emit('activateItem', this.listInstance.name)
            this.listInstance.isActive = true
        }
    }

    confirmClickHandler() {
        this.$emit('selectItem', this.listInstance.name)
    }
}
</script>


<style lang="scss">
</style>