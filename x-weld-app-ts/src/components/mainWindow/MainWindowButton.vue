<template>
    <button @click="clickHandler">
        <img :src="buttonData.buttonImage">
        <span>{{ buttonData.buttonName }}</span>
    </button>
</template>


<script lang="ts">
import { MainWindowButtonInfo } from '@/store/layoutsData/mainWindow/types';
import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export default class MainWindowButton extends Vue {
    @Prop({ required: true }) 
    readonly buttonData: MainWindowButtonInfo

    clickHandler() {
        this.$store.dispatch('windowFlags/openFileBrowseWindow')
    }
}
</script>
