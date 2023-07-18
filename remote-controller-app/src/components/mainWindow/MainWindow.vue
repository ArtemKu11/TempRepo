<template>
    <div class="main-window-container">
        <div class="header">
            <span>
                {{ actualTime }}
            </span>
        </div>
        <div class="center">
            <div class="setting-buttons">
                <div class="green-indicator">
                </div>

                <button class="parameter-button with-icon">
                    <div class="icon-wrapper">
                        <div class="a-icon">a</div>
                    </div>
                    <div class="button-info">
                        <span>16</span>
                        <div class="underline"></div>
                        <span>Ток уст., А</span>
                    </div>
                </button>
                <button class="parameter-button with-icon">
                    <div class="icon-wrapper">
                        <div class="b-icon">b</div>
                    </div>
                    <div class="button-info">
                        <span>220</span>
                        <div class="underline"></div>
                        <span>Напряжение уст., В</span>
                    </div>
                </button>
            </div>
            <div class="fact-buttons">
                <div class="red-indicator">
                </div>
                <button class="parameter-button with-icon">
                    <div class="icon-wrapper">
                    </div>
                    <div class="button-info">
                        <span>10</span>
                        <!-- <div class="underline"></div> -->
                        <span>Ток факт., А</span>
                    </div>
                </button>
                <button class="parameter-button with-icon">
                    <div class="icon-wrapper">
                    </div>
                    <div class="button-info">
                        <span>210</span>
                        <!-- <div class="underline"></div> -->
                        <span>Напряжение факт., В</span>
                    </div>
                </button>
            </div>
        </div>
        <div class="footer"></div>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class MainWindow extends Vue {
    get actualTime(): string {
        return this.$store.getters['ourExtension/layoutsData/baseLayout/getActualTime']();
    }
}
</script>

<style lang="scss">
@import './main_window.scss';
</style>