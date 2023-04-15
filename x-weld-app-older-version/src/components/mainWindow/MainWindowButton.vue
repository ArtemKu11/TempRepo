<template>
    <button @click="clickHandler">
        <img :src="buttonData.buttonImage">
        <span>{{ buttonData.buttonName }}</span>
    </button>
</template>


<script lang="ts">
import FilesMixin from '@/mixins/files';
import ServicesMixin from '@/mixins/services';
import StateMixin from '@/mixins/state';
import { MainWindowButtonInfo } from '@/store/ourExtension/layoutsData/mainWindow/types';
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';

@Component({})
// export default class MainWindowButton extends Vue {
export default class MainWindowButton extends Mixins(StateMixin, FilesMixin, ServicesMixin) {

    @Prop({ required: true })
    readonly buttonData!: MainWindowButtonInfo;


    async clickHandler() {
        if (this.buttonData.buttonName === 'Открыть файл') {
            // this.$store.dispatch('ourExtension/files/getAllFilesAndDirs', 'gcodes')
            this.$store.dispatch('ourExtension/layoutsData/newFileBrowseWindow/setCurrentPath', 'gcodes')
            this.$store.dispatch('ourExtension/windowFlags/openFileBrowseWindow')
        } else {
            this.$store.dispatch('ourExtension/files/getAllFilesAndDirs', 'config')

        }
    }
}
</script>
