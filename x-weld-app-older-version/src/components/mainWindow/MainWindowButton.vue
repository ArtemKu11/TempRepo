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
            this.$store.dispatch('ourExtension/layoutsData/newFileBrowseWindow/setCurrentPath', 'gcodes')
            this.$store.dispatch('ourExtension/windowFlags/openFileBrowseWindow')
        } else if (this.buttonData.buttonName === 'Конфигурация') {
            this.$store.dispatch('ourExtension/layoutsData/profilesWindow/reset')
            this.$store.dispatch('ourExtension/layoutsData/profilesWindow/initWithGlobalProfiles')
            this.$store.dispatch('ourExtension/windowFlags/openProfilesWindow')
        } else {
            // console.log(typeof new Map(), typeof [])
            // const map = new Map([['alala', 'lalala'], ['xyi', 'xisdgf']])
            // for (const [key, value] of map) {
            //     console.log(key, value)
            // }
        }
    }
}
</script>
