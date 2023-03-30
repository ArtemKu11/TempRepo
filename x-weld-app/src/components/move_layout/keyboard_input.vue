<template>
    <div id="keyboard-input-resources">
        <div id="keyboard">
            <button @click="plusButton">+</button>
            <button @click="minusButton"><img src="@/layouts/move_layout/img/tire.png"></button>
            <button @click="pointButton"><img src="@/layouts/move_layout/img/mini-tire.png"></button>
            <button @click="digitButton('1')">1</button>
            <button @click="digitButton('2')">2</button>
            <button @click="digitButton('3')">3</button>
            <button @click="digitButton('4')">4</button>
            <button @click="digitButton('5')">5</button>
            <button @click="digitButton('6')">6</button>
            <button @click="digitButton('7')">7</button>
            <button @click="digitButton('8')">8</button>
            <button @click="digitButton('9')">9</button>
            <button @click="deleteButton"><img src="@/layouts/move_layout/img/delete_keyboard_button.png"></button>
            <button @click="digitButton('0')">0</button>
            <button @click="closeEvent"><img
                    src="@/layouts/move_layout/img/confirm-keyboard-button.png"></button>
        </div>
    </div>
</template>

<script>
export default {
    name: "KeyboardInput",
    props: ['modelValue'],
    emits: ['update:modelValue', 'closeEvent'],
    methods: {
        deleteButton() {
            let newValue = (this.modelValue + "").slice(0, (this.modelValue + "").length - 1);
            if (newValue === "" || newValue === "-") {
                newValue = "0";
            }
            if (newValue.endsWith('.')) {
                this.$emit('update:modelValue', newValue)
            } else {
                this.$emit('update:modelValue', +newValue)
            }
        },
        digitButton(digit) {
            if (!this.lengthCheck()) {
                return;
            }

            let newValue = this.modelValue + "" + digit;
            if (newValue === "") {
                newValue = 0;
            }
            this.$emit('update:modelValue', +newValue)
        },
        plusButton() {
            let firstDigit = (this.modelValue + "").charAt(0);
            if ((firstDigit === '-') && (this.modelValue + "").length > 1) {
                let newValue = (this.modelValue + "").slice(1);
                if (newValue.endsWith('.')) {
                    this.$emit('update:modelValue', newValue)
                } else {
                    this.$emit('update:modelValue', +newValue)
                }
            }
        },
        minusButton() {
            let firstDigit = (this.modelValue + "").charAt(0);
            if (!(firstDigit === '-') && (this.modelValue + "") !== "0") {
                let newValue = '-' + this.modelValue;
                if (newValue.endsWith('.')) {
                    this.$emit('update:modelValue', newValue)
                } else {
                    this.$emit('update:modelValue', +newValue)
                }
            }
        },
        pointButton() {
            let tempValue = this.modelValue + "";
            if (!tempValue.includes('.')) {
                let newValue = tempValue + ".";
                this.$emit('update:modelValue', newValue)
            }
        },
        lengthCheck() {
            let tempValue = this.modelValue + "";
            if (tempValue.includes(".")) {
                let pointIndex = tempValue.indexOf('.');
                let rightSide = tempValue.slice(pointIndex);
                return rightSide.length < 2
            }
            return ((Math.round(Math.abs(+this.modelValue)) + "").length < 5)
        },
        closeEvent() {
            this.$emit('update:modelValue', +this.modelValue)
            this.$emit('closeEvent')
        }
    }
}
</script>