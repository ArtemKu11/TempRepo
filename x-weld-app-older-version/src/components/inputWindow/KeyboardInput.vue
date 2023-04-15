<template>
    <div id="keyboard-input-resources">
        <div id="keyboard">
            <button @click="plusButtonClick">+</button>
            <button @click="minusButtonClick"><img src="@/layouts/move_layout/img/tire.png"></button>
            <button @click="pointButtonClick"><img src="@/layouts/move_layout/img/mini-tire.png"></button>
            <button @click="digitButtonClick('1')">1</button>
            <button @click="digitButtonClick('2')">2</button>
            <button @click="digitButtonClick('3')">3</button>
            <button @click="digitButtonClick('4')">4</button>
            <button @click="digitButtonClick('5')">5</button>
            <button @click="digitButtonClick('6')">6</button>
            <button @click="digitButtonClick('7')">7</button>
            <button @click="digitButtonClick('8')">8</button>
            <button @click="digitButtonClick('9')">9</button>
            <button @click="deleteButtonClick"><img src="@/layouts/move_layout/img/delete_keyboard_button.png"></button>
            <button @click="digitButtonClick('0')">0</button>
            <button @click="confirmButtonClick"><img src="@/layouts/move_layout/img/confirm-keyboard-button.png"></button>
        </div>
    </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class KeyboardInput extends Vue {
    get processingValue(): string {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getProcessingValue']
    }

    lengthCheck() {
        const currentValue = this.processingValue;
        if (currentValue.includes(".")) {
            const pointIndex = currentValue.indexOf('.');
            const rightSide = currentValue.slice(pointIndex);
            return rightSide.length < 2
        }
        return ((Math.round(Math.abs(+currentValue)) + "").length < 5)
    }

    confirmButtonClick() {
        this.$store.dispatch('ourExtension/layoutsData/inputWindow/confirm')
    }

    digitButtonClick(digitValue: string) {
        if (!this.lengthCheck()) {
            return;
        }

        let newValue = +(this.processingValue + digitValue) + '';
        if (newValue === "") {
            newValue = '0';
        }
        this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
    }

    deleteButtonClick() {
        const currentValue = this.processingValue;
        let newValue = (currentValue + "").slice(0, (currentValue + "").length - 1);
        if (newValue === "" || newValue === "-") {
            newValue = "0";
        }
        if (newValue.endsWith('.')) {
            this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
        } else {
            this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', (+newValue + ''))
        }
    }

    pointButtonClick() {
        const currentValue = this.processingValue;
        if (!currentValue.includes('.')) {
            const newValue = currentValue + ".";
            this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
        }
    }

    plusButtonClick() {
        const currentValue = this.processingValue;
        let firstDigit = (currentValue).charAt(0);
        if ((firstDigit === '-') && currentValue.length > 1) {
            const newValue = currentValue.slice(1);
            if (newValue.endsWith('.')) {
                this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
            } else {
                this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', (+newValue + ''))
            }
        }
    }

    minusButtonClick() {
        const currentValue = this.processingValue;
        let firstDigit = currentValue.charAt(0);
        if (!(firstDigit === '-') && currentValue !== "0") {
            const newValue = '-' + currentValue;
            if (newValue.endsWith('.')) {
                this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', newValue)
            } else {
                this.$store.commit('ourExtension/layoutsData/inputWindow/setProcessingValue', (+newValue + ''))
            }
        }
    }
}
</script>