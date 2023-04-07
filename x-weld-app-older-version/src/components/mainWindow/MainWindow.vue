<template>
    <div class="content-container main-window-layout">
        <div id="content-header">
            <img src="@/layouts/main_window_layout/img/xweld_logo.png">
        </div>
        <div id="content-center">
            <div id="icon-holder">
                <!-- <MainWindowButton /> -->
                <MainWindowButton v-for="buttonData of listOfButtons" :key="buttonData.buttonId" :buttonData="buttonData"/>
            </div>
        </div>
        <div id="content-footer"></div>
    </div>
</template>


<script lang="ts">
import { MainWindowButtonInfo } from '@/store/ourExtension/layoutsData/mainWindow/types';
import { Component, Vue } from 'vue-property-decorator';
import MainWindowButton from './MainWindowButton.vue';

@Component({
    components: {
        MainWindowButton
    },
})

export default class MainWindow extends Vue {
    get listOfButtons(): Array<MainWindowButtonInfo> {
        return this.$store.getters["ourExtension/layoutsData/mainWindow/getButtonList"];
    }
}
</script>


<style lang="scss">
@import '@/layouts/main_window_layout/css/main_window_layout.scss';
</style>
