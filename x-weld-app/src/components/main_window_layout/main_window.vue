<template>
    <div class="content-container main-window-layout">
        <div id="content-header">
            <img src="@/layouts/main_window_layout/img/xweld_logo.png">
        </div>
        <div id="content-center">
            <div id="icon-holder">
                <MainWindowButton @mainWindowButtonClick="mainWindowButtonClickHandler" v-for="buttonData of buttonList"
                    :buttonData=buttonData />
            </div>
        </div>
        <div id="content-footer"></div>
    </div>
</template>

<script>
import MainWindowButton from "@/components/main_window_layout/main_window_button.vue"

export default {
    name: "MainWindow",
    components: { MainWindowButton },
    data() {
        return {
            buttonList: [
                {
                    buttonName: "Открыть файл",
                    buttonImage: require("@/layouts/main_window_layout/img/open_file_icon.png")
                },

                {
                    buttonName: "Допечатная подготовка",
                    buttonImage: require("@/layouts/main_window_layout/img/move_icon.png")
                },

                {
                    buttonName: "Конфигурация",
                    buttonImage: require("@/layouts/main_window_layout/img/config_icon.png")
                },

                {
                    buttonName: "Печать",
                    buttonImage: require("@/layouts/main_window_layout/img/print_icon.png")
                },
            ]
        }
    },
    methods: {
        mainWindowButtonClickHandler(buttonName) {
            this.$emit('mainWindowButtonClick', buttonName);
        }
    }

}
</script>

<style lang="scss">
@import '@/layouts/main_window_layout/css/main_window_layout.scss';
</style>