<template>
    <div class="big-coord-button">
        <label for="big-coord-button" class="coord-label">Y</label>
        <div class="over transposed">
            <button @click="plusClick" class="big-plus-button"></button>
            <button @click="minusClick" class="big-minus-button"></button>
        </div>
        <img src="@/layouts/move_layout/img/big_coord_button_transposed.png" height="100" />
    </div>
</template>

<script>
export default {
    name: "YBigButton",
    props: ['modelValue', 'step'],
    emits: ['update:modelValue'],
    methods: {
        minusClick() {
            let newValue = this.round(this.modelValue - this.step);

            this.$emit('update:modelValue', newValue);
        },
        plusClick() {
            let newValue = this.round(+this.modelValue + +this.step);
            this.$emit('update:modelValue', newValue);
        },
        round(value) {
            return Math.round(+value * 10) / 10;
        }
    }
}
</script>