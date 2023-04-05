<template>
    <div class="content-container main-window-layout">
        <div id="content-header">
            <img src="@/layouts/main_window_layout/img/xweld_logo.png">
        </div>
        <div id="content-center">
            <div id="icon-holder">
                <MainWindowButton v-for="buttonData of listOfButtons" :key="buttonData" :buttonData="buttonData"/>
            </div>
        </div>
        <div id="content-footer"></div>
    </div>
</template>


<script lang="ts">
import { MainWindowButtonInfo } from '@/store/layoutsData/mainWindow/types';
import { Vue, Options } from 'vue-class-component';
import MainWindowButton from './MainWindowButton.vue'

@Options({
    components: {
        MainWindowButton
    },
})
export default class MainWindow extends Vue {
    get listOfButtons(): Array<MainWindowButtonInfo> {
        return this.$store.getters["layoutsData/mainWindow/getButtonList"];
    }
}
</script>


<style lang="scss">
@import '@/layouts/main_window_layout/css/main_window_layout.scss';
</style>
