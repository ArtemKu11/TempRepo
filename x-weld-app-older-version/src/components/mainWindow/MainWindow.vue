<template>
    <div class="content-container main-window-layout">
        <div id="content-header">
            <span v-if="warningFlag" @click="warningClickHandler">WARNING</span>

            <img src="@/layouts/main_window_layout/img/xweld_logo.png">
        </div>
        <div id="content-center">
            <div id="icon-holder">
                <!-- <MainWindowButton /> -->
                <MainWindowButton v-for="buttonData of listOfButtons" :key="buttonData.buttonId" :buttonData="buttonData" />
            </div>
        </div>
        <div id="content-footer"></div>
    </div>
</template>


<script lang="ts">
import { MainWindowButtonInfo } from '@/store/ourExtension/layoutsData/mainWindow/types';
import { Component, Mixins, Vue } from 'vue-property-decorator';
import MainWindowButton from './MainWindowButton.vue';
import StateMixin from '@/mixins/state';
import { AlertType } from '@/store/ourExtension/layoutsData/alerts/types';

@Component({
    components: {
        MainWindowButton
    },
})

export default class MainWindow extends Mixins(StateMixin) {
    get listOfButtons(): Array<MainWindowButtonInfo> {
        return this.$store.getters["ourExtension/layoutsData/mainWindow/getButtonList"];
    }

    get warningFlag(): boolean {
        return !this.klippyReady || !this.klippyConnected
    }

    warningClickHandler() {
        const message = this.klippyStateMessage + '<style>.message-holder {text-align:start !important;}</style>'
        const alert: AlertType = {
            message: message,
            type: 'ok',
            header: 'ОШИБКА!'
        }
        this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
    }
}
</script>


<style lang="scss">
@import '@/layouts/main_window_layout/css/main_window_layout.scss';
</style>
