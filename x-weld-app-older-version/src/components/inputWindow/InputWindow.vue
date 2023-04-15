<template>
    <div id="input-utils-main-container">
        <div id="input-utils-container">
            <div id="input-info">
                <DefaultInputInfo v-if="defaultImplementationFlag" />
                <div class="input-info-part">
                    <div class="holder">
                        <button @click="setKeyboardFLag(true)"><img src="@/layouts/move_layout/img/keyboard_button.svg" width="78" height="78" /><span>Ручной
                                ввод</span></button>
                        <button @click="setKeyboardFLag(false)"><img src="@/layouts/move_layout/img/valcoder.png" width="78" height="78" /><span>Валкодер</span></button>
                    </div>


                </div>
            </div>

            <KeyboardInput v-if="keyboardFlag" />
            <ValcoderInput v-else />

        </div>
    </div>
</template>


<script lang="ts">
import { FlagsObject, InputWindowData } from '@/store/ourExtension/layoutsData/inputWindow/types';
import { Component, Vue } from 'vue-property-decorator';
import KeyboardInput from './KeyboardInput.vue';
import ValcoderInput from './ValcoderInput.vue';
import DefaultInputInfo from './DefaultInputInfo.vue';

@Component({
    components: {
        KeyboardInput, ValcoderInput, DefaultInputInfo
    },
})
export default class InputWindow extends Vue {
    
    get defaultImplementationFlag(): boolean {
        const flags = this.$store.getters['ourExtension/layoutsData/inputWindow/getFlags'] as FlagsObject
        return flags.defaultImplementation;
    }

    get processingValue(): string {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getProcessingValue']
    }

    get keyboardFlag(): boolean {
        return this.$store.getters['ourExtension/layoutsData/inputWindow/getKeyboardFlag']()
    }

    setKeyboardFLag(newFlag: boolean) {
        this.$store.commit('ourExtension/layoutsData/inputWindow/setKeyboardFlag', newFlag);
    }
}
</script>


<style lang="scss">
@import "@/layouts/move_layout/css/input_layout.scss";
</style>