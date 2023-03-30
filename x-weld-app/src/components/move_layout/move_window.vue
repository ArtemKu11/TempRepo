<template>
    <div class="content-container move-layout">
        <div id="content-header">
            <div id="name-container">Профиль печати для всех слоев (124-275)</div>
            <div id="coordinates-container">
                <img src="@/layouts/move_layout/img/gorelka_logo.svg" />
                <span id="x-coords">{{ modelValue.xCoord }}</span>
                <span id="y-coords">{{ modelValue.yCoord }}</span>
                <span id="z-coords">{{ modelValue.zCoord }}</span>
            </div>
        </div>
        <div id="content-center">
            <div id="buttons-container">
                <div id="two-control-buttons">
                    <button @click="temp"><img src="@/layouts/move_layout/img/axis_refresh.png" height="50" /><span>Сброс
                            осей</span></button>
                    <button><img src="@/layouts/move_layout/img/park.png" height="50" /><span>Парковка</span></button>
                </div>

                <XBigButton v-model="modelValue.xCoord" :step="modelValue.scrollbarStep" />
                <YBigButton v-model="modelValue.yCoord" :step="modelValue.scrollbarStep" />
                <ZBigButton v-model="modelValue.zCoord" :step="modelValue.scrollbarStep" />

            </div>
            <div id="lables-container">
                <div class="coord-label-div x">
                    <KeyboardButton @click="this.$emit('keyboardClick', 'X')" />
                    <span>{{ modelValue.xCoord }}</span>
                    <span>мм</span>
                </div>
                <div class="coord-label-div y">
                    <KeyboardButton @click="this.$emit('keyboardClick', 'Y')" />
                    <span>{{ modelValue.yCoord }}</span>
                    <span>мм</span>
                </div>
                <div class="coord-label-div z">
                    <KeyboardButton @click="this.$emit('keyboardClick', 'Z')" />
                    <span>{{ modelValue.zCoord }}</span>
                    <span>мм</span>
                </div>
            </div>
            <Scrollbar v-model="modelValue.scrollbarStep" />

        </div>
    </div>
</template>

<script>
import KeyboardButton from "@/components/move_layout/keyboard_button.vue"
import Scrollbar from "@/components/move_layout/scrollbar.vue"
import XBigButton from "@/components/move_layout/x_big_button.vue"
import YBigButton from "@/components/move_layout/y_big_button.vue"
import ZBigButton from "@/components/move_layout/z_big_button.vue"

export default {
    name: "MoveWindow",
    props: ['modelValue'],
    components: { KeyboardButton, Scrollbar, XBigButton, YBigButton, ZBigButton },
    methods: {
    }
}
</script>

<style lang="scss">
@import "@/layouts/move_layout/css/move_layout.scss";
</style>