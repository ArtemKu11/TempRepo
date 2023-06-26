<template>
    <div class="print-window">
        <div v-if="!pause" class="green-indicator">
        </div>

        <div v-if="pause" class="red-indicator">
        </div>

        <div class="header">
            <div class="time-and-operation">
                <div @click="$router.go(-1)" class="time-holder">12:39</div>
                <div class="operation-container">Пауза...</div>
            </div>
            <div class="warnings-container">
                <span>WARNING</span>
                <span>NO GAS</span>
                <span>COLLISION</span>
            </div>
        </div>

        <div class="center">
            <div class="rejim">
                <span>Параметры режима: </span>
                <span>алюминиево-магниевые сплавы</span>
            </div>
            <div class="print-params-buttons">
                <div class="colorful-buttons">
                    <button class="parameter-button with-icon">
                        <div class="icon-wrapper">
                            <div class="a-icon">a</div>
                        </div>
                        <div class="button-info">
                            <span>215</span>
                            <div class="underline"></div>
                            <span>Ток, А</span>
                        </div>

                    </button>
                    <button class="parameter-button with-icon">
                        <div class="icon-wrapper">
                            <div class="b-icon">b</div>
                        </div>
                        <div class="button-info">
                            <span>380</span>
                            <div class="underline"></div>
                            <span>Напряжение, В</span>
                        </div>
                    </button>
                    <button class="parameter-button">
                        <span>0.6</span>
                        <div class="underline"></div>
                        <span>V подачи, м/мин</span>
                    </button>
                </div>

                <span class="print-params-span">Параметры печати:</span>

                <div class="usual-buttons">
                    <button class="parameter-button">
                        <div class="img-wrapper">
                            <img src="@/style/printWindow/img/oscillation.svg" width="105" height="1">
                        </div>
                        <span>Тип: Обычная</span>
                    </button>
                    <button class="parameter-button">
                        <span>16.0</span>
                        <span>V печати, м/мин</span>
                    </button>
                    <button class="parameter-button">
                        <span>1.2</span>
                        <span>Сдвиг Z, мм</span>
                    </button>
                </div>
            </div>
            <div class="control-prints">
                <div class="control-print current">
                    <div class="a-icon">a</div>
                    <span>Ток источника</span>
                </div>
                <div class="control-print voltage">
                    <div class="b-icon">b</div>
                    <span>Напряжение источника</span>
                </div>
                <div class="control-print img layers">
                    <span>Слои: 241/399</span>
                    <img src="@/style/printWindow/img/layers.svg" alt="">
                </div>
                <div class="control-print img heigth">
                    <span>Высота, мм: 2000</span>
                    <img src="@/style/printWindow/img/heigth.svg" alt="">
                </div>
            </div>
        </div>

        <div class="control-buttons">

            <div v-if="!pause" class="big-round-button-wrapper">
                <button class="big-round-button">
                    <span class="percent">45%</span>
                    <svg>
                        <defs>
                            <linearGradient id="grad1">
                                <stop offset="0%" stop-color="rgba(0, 178, 202, 1)" />
                                <stop offset="100%" stop-color="rgba(4, 112, 200, 1)" stop-opacity="1" />
                            </linearGradient>
                        </defs>
                        <circle ref="circleBar" transform="rotate(-90 176 176)" stroke-dasharray="423.9 518.1" cx="176"
                            cy="176" r="150" stroke="url(#grad1)" stroke-width="7px" fill="transparent">
                        </circle>
                    </svg>
                </button>
            </div>

            <button v-if="pause" :class="{ 'active': buttonsState.firstButton }"
                @touchstart="touchStartHandler($event, 'firstButton')" @touchend="touchEndHandler('firstButton')"
                class="control-button move">
                <div class="img-wrapper">
                    <img src="@/style/printWindow/img/move.svg" alt="">
                </div>
                <span>Перемещение</span>
            </button>

            <button v-if="pause" :class="{ 'active': buttonsState.secondButton }"
                @touchstart="touchStartHandler($event, 'secondButton')" @touchend="touchEndHandler('secondButton')"
                class="control-button layer-settings">
                <div class="img-wrapper">
                    <img src="@/style/printWindow/img/layer_settings.svg" alt="">
                </div>
                <span>Параметры слоя</span>
            </button>

            <button v-if="pause" :class="{ 'active': buttonsState.thirdButton }"
                @touchstart="touchStartHandler($event, 'thirdButton')" @touchend="touchEndHandler('thirdButton')"
                class="control-button settings">
                <div class="img-wrapper">
                    <img src="@/style/printWindow/img/settings.svg" alt="">
                </div>
                <span>Настройки</span>
            </button>

            <button :class="{ 'active': buttonsState.fourthButton }"
                @touchstart="touchStartHandler($event, 'fourthButton')" @touchend="touchEndHandler('fourthButton')"
                class="control-button revert shift-plus">
                <span>Сдвиг +</span>
                <div class="img-wrapper">
                    <img src="@/style/printWindow/img/shift_plus.svg" alt="">
                </div>
            </button>
            
            <button :class="{ 'active': buttonsState.fifthButton }"
                @touchstart="touchStartHandler($event, 'fifthButton')" @touchend="touchEndHandler('fifthButton')"
                class="control-button revert shift-minus">
                <span>Сдвиг -</span>
                <div class="img-wrapper">
                    <img src="@/style/printWindow/img/shift_minus.svg" alt="">
                </div>
            </button>

            <button :class="{ 'active': buttonsState.sixthButton }"
                @touchstart="touchStartHandler($event, 'sixthButton')" @touchend="touchEndHandler('sixthButton')"
                class="control-button revert arc">
                <span>Дуга неизвестна</span>
                <div class="img-wrapper">
                    <img src="@/style/printWindow/img/arc.svg" alt="">
                </div>
            </button>
        </div>

        <div v-if="pause" class="footer">
            <div class="file-info">
                <div class="filename">
                    <img src="@/style/printWindow/img/file_icon.svg" alt="">
                    <span>3D_Printer_test_fixed_stl_3rd_gen...</span>
                </div>
                <div class="progress">
                    <img src="@/style/printWindow/img/progress.svg" alt="">
                    <span>Прогресс: 45%</span>
                </div>
            </div>

            <div class="progress-bar-wrapper">
                <img src="@/style/printWindow/img/progress_bar.svg" alt="">
                <div class="progress-wrapper">
                    <div class="progress"></div>
                </div>
            </div>
        </div>

        <div v-if="!pause" class="only-filename">
            <img src="@/style/printWindow/img/big_file_icon.svg" alt="">
            <span>3D_Printer_test_fixed_stl_3rd_gen...</span>
        </div>

    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class PrintWindow extends Vue {
    pause = false

    buttonsState = {  // флаги для бинда .active класса для мнгновенной подмены картинок по touchstart
        firstButton: false,  // Перемещение
        secondButton: false,  // Параметры слоя
        thirdButton: false, // Настройки
        fourthButton: false,  // Сдвиг +
        fifthButton: false,  // Сдвиг -
        sixthButton: false  // Дуга
    }


    touchStartHandler(e: TouchEvent, button: string) {
        if (button in this.buttonsState) {
            const state = this.buttonsState as any
            state[button] = true
            if (e.cancelable) {
                e.preventDefault()
                e.stopPropagation()
            }
            this.resolveButtonClick(button)
        }
    }

    resolveButtonClick(button: string) {
        switch (button) {
            case "fourthButton":
                return;
            case "sixthButton":
                this.changePause()
                return;
            default:
                return;
        }
    }

    touchEndHandler(button: string) {
        if (button in this.buttonsState) {
            const state = this.buttonsState as any
            state[button] = false
        }
    }

    changePause() {
        this.pause = !this.pause
    }

    openFileSelect() {
        // this.$router.push('/')
    }

    openOscillation() {
        this.$router.push('/osc')
    }

}
</script>


<style lang="scss">@import '@/style/printWindow/css/printWindow.scss';</style>