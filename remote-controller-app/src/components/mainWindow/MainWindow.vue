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
                        <span>{{ voltageSp }}</span>
                        <div class="underline"></div>
                        <span>Напряжение уст., В</span>
                    </div>
                </button>
                <button class="parameter-button with-icon">
                    <div class="icon-wrapper">
                        <div class="b-icon">b</div>
                    </div>
                    <div class="button-info">
                        <span>{{ currentSp }}</span>
                        <div class="underline"></div>
                        <span>Ток уст., А</span>
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
                        <span>{{ voltageRead }}</span>
                        <!-- <div class="underline"></div> -->
                        <span>Напряжение факт., В</span>
                    </div>
                </button>
                <button @click="clickHandler" class="parameter-button with-icon">
                    <div class="icon-wrapper">
                    </div>
                    <div class="button-info">
                        <span>{{ currentRead }}</span>
                        <!-- <div class="underline"></div> -->
                        <span>Ток факт., А</span>
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

    get voltageSp() {
        return this.$store.state.printer.printer.plasma_modbus.voltage_sp
    }

    get currentSp() {
        return this.$store.state.printer.printer.plasma_modbus.current_sp
    }

    get voltageRead() {
        return this.$store.state.printer.printer.plasma_modbus.voltage_read
    }

    get currentRead() {
        return this.$store.state.printer.printer.plasma_modbus.current_read
    }

    clickHandler() {
        console.log(this.$store.state.printer.printer.plasma_modbus)
        console.log(this.$store.state.printer.printer.gorn)

    }
}
</script>

<style lang="scss">
@import './main_window.scss';
</style>