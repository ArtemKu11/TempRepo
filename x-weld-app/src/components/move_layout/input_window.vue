<template>
    <div id="input-utils-main-container">
        <div id="input-utils-container">
            <div id="input-info">
                <div class="input-info-part">
                    <div class="holder">
                        <span id="label-coord"> {{ coordName }}</span>
                        <span id="label-value">{{ coordValue }}</span>
                        <span id="label-mills">мм</span>
                    </div>
                </div>
                <div class="input-info-part">
                    <div class="holder">
                        <button @click="this.keyboardFlag = true"><img src="@/layouts/move_layout/img/keyboard_button.svg"
                                width="78" height="78" /><span>Ручной
                                ввод</span></button>
                        <button @click="this.keyboardFlag = false"><img src="@/layouts/move_layout/img/valcoder.png"
                                width="78" height="78" /><span>Валкодер</span></button>
                    </div>


                </div>
            </div>

            <KeyboardInput @closeEvent="closeEvent" v-if="this.keyboardFlag" v-model="coordValue" />
            <ValcoderInput @cancelEvent="cancelEvent" @closeEvent="closeEvent" v-else v-model="coordValue"
                :step="this.modelValue.scrollbarStep" />

        </div>
    </div>
</template>

<script>
import KeyboardInput from "@/components/move_layout/keyboard_input.vue"
import ValcoderInput from "@/components/move_layout/valcoder_input.vue"
export default {
    name: "InputLayout",
    components: { KeyboardInput, ValcoderInput },
    props: ['modelValue', 'coordName'],
    data() {
        return {
            keyboardFlag: true,
            coordValue: 0
        }
    },
    mounted() {
        switch (this.coordName) {
            case 'X':
                this.coordValue = this.modelValue.xCoord;
                break;
            case 'Y':
                this.coordValue = this.modelValue.yCoord;
                break;
            case 'Z':
                this.coordValue = this.modelValue.zCoord;
                break;

            default:
                break;
        }
    },
    methods: {
        closeEvent() {
            switch (this.coordName) {
                case 'X':
                    this.modelValue.xCoord = this.coordValue;
                    break;
                case 'Y':
                    this.modelValue.yCoord = this.coordValue;
                    break;
                case 'Z':
                    this.modelValue.zCoord = this.coordValue;
                    break;

                default:
                    break;
            }
            this.$emit('closeEvent')
        },

        cancelEvent() {
            this.$emit('closeEvent')
        }
    }

}
</script>