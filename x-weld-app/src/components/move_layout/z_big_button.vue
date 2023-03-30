<template>
    <div class="big-coord-button">
        <label for="big-coord-button" class="coord-label">Z</label>

        <div class="over transposed">
            <button @click="minusClick" class="big-minus-button"></button>
            <button @click="plusClick" class="big-plus-button"></button>
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
        // round(value) {
        //     let temp = Math.round(+value * 10);
        //     if (temp % 10 == 0) {
        //         return (temp / 10).toFixed(0);
        //     }
        //     return (temp / 10).toFixed(1)
        // }
    }
}
</script>