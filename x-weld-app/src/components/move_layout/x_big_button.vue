<template>
    <div class="big-coord-button">
        <label for="big-coord-button" class="coord-label">X</label>
        <div class="over">
            <button @click="minusClick" class="big-minus-button x"></button>
            <button @click="plusClick" class="big-plus-button x"></button>
        </div>
        <img src="@/layouts/move_layout/img/big_coord_button.png" height="100" />
    </div>
</template>

<script>
export default {
    name: "XBigButton",
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