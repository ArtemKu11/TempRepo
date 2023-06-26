<template>
    <div class="oscillation-window">

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
            <div class="logo">
                <img src="@/style/oscillationWindow/img/mini_settings.svg" alt="">
                <span>Параметры осцилляции:</span>
            </div>

            <div class="colorful-buttons">

                <button class="parameter-button with-icon">
                    <div v-if="state.type" class="icon-wrapper">
                        <div class="a-icon">a</div>
                    </div>
                    <div class="button-info">
                        <div class="img-wrapper">
                            <img src="@/style/oscillationWindow/img/many_triangular_active.svg" width="105">
                        </div>
                        <div class="underline"></div>
                        <span>Тип</span>
                    </div>
                </button>

                <!-- <button v-else class="parameter-button">
                    <div class="img-wrapper">
                        <img src="@/style/oscillationWindow/img/many_triangular_active.svg" width="105">
                    </div>
                    <div class="underline"></div>
                    <span>Тип</span>
                </button> -->



                <button class="parameter-button with-icon">
                    <div v-if="state.width" class="icon-wrapper">
                        <div class="a-icon">a</div>
                    </div>
                    <div class="button-info">
                        <span>12.5</span>
                        <div class="underline"></div>
                        <span>Ширина, мм</span>
                    </div>

                </button>
                <button class="parameter-button with-icon">
                    <div v-if="state.period" class="icon-wrapper">
                        <div class="a-icon">a</div>
                    </div>
                    <div class="button-info">
                        <span>2.4</span>
                        <div class="underline"></div>
                        <span>Период, мм</span>
                    </div>
                </button>

            </div>

            <div v-if="state.type" class="oscillation-select">
                <button class="oscillation-button no-osc first">
                    <img src="@/style/oscillationWindow/img/no_osc.svg" alt="">
                    <span>Нет осцилляции</span>
                    <hr>
                </button>
                <button class="oscillation-button triangular second">
                    <img src="@/style/oscillationWindow/img/triangular.svg" alt="">
                    <span>Треугольная</span>
                    <hr>
                </button>
                <button class="oscillation-button sin third">
                    <img src="@/style/oscillationWindow/img/sin.svg" alt="">
                    <span>Синусоида</span>
                    <hr>
                </button>
                <button class="oscillation-button no-osc fourth">
                    <img src="@/style/oscillationWindow/img/no_osc.svg" alt="">
                    <span>Нет осцилляции</span>
                    <hr>
                </button>
                <button class="oscillation-button sin fifth">
                    <img src="@/style/oscillationWindow/img/sin.svg" alt="">
                    <span>Синусоида</span>
                    <hr>
                </button>
            </div>
        </div>

        <div class="control-buttons">

            <button @click="typeClick" class="control-button first" :class="{ 'active': state.type }">
                <div class="indicator">
                </div>
                <span>Тип</span>
            </button>

            <button @click="widthClick" class="control-button second" :class="{ 'active': state.width }">
                <div class="indicator">
                </div>
                <span>Ширина</span>
            </button>

            <button @click="periodClick" class="control-button third" :class="{ 'active': state.period }">
                <div class="indicator">
                </div>
                <!-- <div class="img-wrapper">
                    <img src="@/style/printWindow/img/settings.svg" alt="">
                </div> -->
                <span>Период</span>
            </button>

            <button @click="openFileSelect" v-if="state.type" class="control-button revert fourth">
                <span>Следующая</span>
                <div class="img-wrapper">
                    <img src="@/style/oscillationWindow/img/next.svg" alt="">
                </div>
            </button>

            <button v-else="state.type" class="control-button revert fourth increase">
                <span>Увеличить +</span>
                <div class="img-wrapper">
                    <img src="@/style/oscillationWindow/img/increase.svg" alt="">
                </div>
            </button>

            <button v-if="state.type" class="control-button revert fifth">
                <span>Предыдущая</span>
                <div class="img-wrapper">
                    <img src="@/style/oscillationWindow/img/prev.svg" alt="">
                </div>
            </button>

            <button v-else="state.type" class="control-button revert fifth decrease">
                <span>Уменьшить -</span>
                <div class="img-wrapper">
                    <img src="@/style/oscillationWindow/img/decrease.svg" alt="">
                </div>
            </button>

            <button class="control-button revert sixth">
                <span>По умолчанию</span>
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

    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class OscillationWindow extends Vue {
    pause = false
    state = {
        type: false,
        width: true,
        period: false
    }

    typeClick() {
        const falseState = this.getFalseState()
        falseState.type = true
        this.state = falseState
    }

    widthClick() {
        const falseState = this.getFalseState()
        falseState.width = true
        this.state = falseState
    }

    periodClick() {
        const falseState = this.getFalseState()
        falseState.period = true
        this.state = falseState
    }

    getFalseState() {
        const state = JSON.parse(JSON.stringify(this.state)) as any
        for (const flag in state) {
            state[flag] = false
        }
        return state
    }

    openFileSelect() {
        this.$router.push('/')
    }
}
</script>


<style lang="scss">
@import '@/style/oscillationWindow/css/oscillationWindow.scss';
</style>