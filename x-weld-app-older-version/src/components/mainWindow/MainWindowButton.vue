<template>
    <button @click="clickHandler">
        <img :src="buttonData.buttonImage">
        <span>{{ buttonData.buttonName }}</span>
    </button>
</template>


<script lang="ts">
import { SocketActions } from '@/api/socketActions';
import { MainWindowButtonInfo } from '@/store/ourExtension/layoutsData/mainWindow/types';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class MainWindowButton extends Vue {
    @Prop({ required: true })
    readonly buttonData!: MainWindowButtonInfo;


    clickHandler() {
        // SocketActions.serverFilesListRoot('config')
        this.$store.dispatch('ourExtension/windowFlags/openFileBrowseWindow')
        console.log(this.$store.state.files)
    }
}
</script>
