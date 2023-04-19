<template>
    <div id="input-utils-main-container">
        <div id="input-utils-container">
            <div class="input-info" :class="{ 'not-default': notDefaultImplementationFlag, 'default': defaultImplementationFlag }">
                <DefaultInputInfo v-if="defaultImplementationFlag" />
                <NotDefaultInputInfo v-if="notDefaultImplementationFlag" />
                <div class="input-info-part" >
                    <div class="holder">
                        <button @click="setKeyboardFLag(true)"><img src="@/layouts/move_layout/img/keyboard_button.svg"
                                width="78" height="78" /><span>Ручной
                                ввод</span></button>
                        <button @click="setKeyboardFLag(false)"><img src="@/layouts/move_layout/img/valcoder.png" width="78"
                                height="78" /><span>Валкодер</span></button>
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
import NotDefaultInputInfo from './NotDefaultInputInfo.vue';

@Component({
    components: {
        KeyboardInput, ValcoderInput, DefaultInputInfo, NotDefaultInputInfo
    },
})
export default class InputWindow extends Vue {

    get defaultImplementationFlag(): boolean {
        const flags = this.$store.getters['ourExtension/layoutsData/inputWindow/getFlags'] as FlagsObject
        return flags.defaultImplementation;
    }

    get notDefaultImplementationFlag(): boolean {
        const flags = this.$store.getters['ourExtension/layoutsData/inputWindow/getFlags'] as FlagsObject
        return flags.notDefaultImplementation;
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

.input-info.not-default {
    padding: 10% 0;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    row-gap: 10%;

    .input-info-part {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;

        .holder {
            width: 500px;
        }

        &:first-of-type {
            .holder {
                align-self: flex-end;
                justify-self: center;
                max-width: 400px;
                display: grid;
                grid-template-rows: 4fr 1fr;
                grid-template-columns: 1fr;
                gap: 10px;
                color: white;
                align-items: center;
                justify-items: center;

                #label-coord {
                    font-size: 90px;
                    grid-column: 1;
                    grid-row: 1;
                    color: rgba(109, 109, 109, 1);

                }

                #label-value {
                    font-size: 90px;
                    // grid-column: 2;
                    // grid-row: 1;
                }

                #label-mills {
                    font-size: 25px;
                    // grid-column: 2;
                    // grid-row: 2;
                    color: #C7C7C7;

                }
            }
        }

        &:last-of-type {
            grid-template-rows: 1fr;

            .holder {
                justify-self: center;
                align-self: flex-start;
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr;

                button {
                    justify-self: center;
                    align-self: center;
                    width: 110px;
                    height: 110px;
                    background: none;
                    border: none;
                    color: rgba(199, 199, 199, 1);
                    font-size: 20px;
                    display: grid;
                    grid-template-rows: 80% 20%;
                    align-items: center;
                    justify-items: center;
                    user-select: none;

                    &:first-of-type {
                        width: 120px;

                    }

                    span {
                        display: block;
                    }

                    img {
                        pointer-events: none;
                    }

                    &:hover {
                        cursor: pointer;
                    }

                    &:active {
                        &:first-of-type {
                            img {
                                content: url('@/layouts/profiles_layout/img/keyboard_button_active.svg');
                                width: 110%;
                                height: 110%;
                            }

                            color: white;
                        }

                        &:last-of-type {
                            img {
                                content: url('@/layouts/profiles_layout/img/valcoder_active.png');
                                width: 90%;
                                height: 110%;
                            }

                            color: white;
                        }
                    }

                }
            }
        }
    }
}
</style>