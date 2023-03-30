<template>
    <div id="sidebar">
        <div id="sidebar-time-holder">12:39</div>
        <div id="sidebar-button-holder">
            <button @click="toMainWindow" class="sidebar-button menu"></button>
            <button @click="moveButtonClick" class="sidebar-button move"></button>
            <button @click="tempMethod" class="sidebar-button star"></button>
            <button class="sidebar-button settings"></button>
            <button @click="backButtonClick" class="sidebar-button back"></button>
        </div>
        <div id="sidebar-footer"></div>
    </div>
    <InputWindow @closeEvent="this.inputLayoutDisplayFlag = false" v-if="this.inputLayoutDisplayFlag"
        v-model="modelInfoForMoveLayout" :coordName="coordNameForInputLayout" />

    <MoveWindow @keyboardClick="showInputLayout" v-if="this.moveLayoutDisplayFlag"
        v-model="modelInfoForMoveLayout" />

    <OpenFileWindow v-if="openFileLayoutDisplayFlag" />

    <FileSelectWindow v-if="fileSelectLayoutDisplayFlag" @goHome="() => { this.fileSelectLayoutDisplayFlag = false }"
        @openFile="openFileClickHandle" />

    <MainWindow v-if="mainWindowDisplayFlag" @mainWindowButtonClick="mainWindowButtonClickHandler" />
</template>

<script>
import MainWindow from "@/components/main_window_layout/main_window.vue"
import FileSelectWindow from "@/components/main_window_layout/file_select_window.vue"
import OpenFileWindow from "@/components/open_file_layout/open_file_window.vue"
import MoveWindow from "@/components/move_layout/move_window.vue"
import InputWindow from "@/components/move_layout/input_window.vue"

export default {
    name: 'App',
    components: {
        MainWindow, FileSelectWindow, OpenFileWindow, MoveWindow, InputWindow
    },
    data() {
        return {
            mainWindowDisplayFlag: true,  // true/false -> включает/отключает главный экран
            fileSelectLayoutDisplayFlag: false,  // true/false -> включает/отключает окно выбора файла для печати 
            openFileLayoutDisplayFlag: false,  // true/false -> включает/отключает окно с выбранным файлом
            moveLayoutDisplayFlag: false,
            inputLayoutDisplayFlag: false,
            modelInfoForMoveLayout: {
                scrollbarStep: 1.0,  // v-model для скроллбара (меняется)
                xCoord: 2999,
                yCoord: 380,
                zCoord: 0.6
            },
            coordNameForInputLayout: "X"
        }
    },
    methods: {
        mainWindowButtonClickHandler(buttonName) {
            switch (buttonName) {
                case "Открыть файл":
                    if (!this.fileSelectLayoutDisplayFlag) {
                        this.fileSelectLayoutDisplayFlag = true;
                    }
                    break;
                case "Допечатная подготовка":
                    this.mainWindowDisplayFlag = false;
                    this.moveLayoutDisplayFlag = true;
                default:
                    break;
            }
        },
        openFileClickHandle(fileData) {
            console.log(fileData);
            this.fileSelectLayoutDisplayFlag = false;
            this.mainWindowDisplayFlag = false;
            this.openFileLayoutDisplayFlag = true;
        },
        backButtonClick() {

            if (this.inputLayoutDisplayFlag) {
                this.inputLayoutDisplayFlag = false;
                return;
            }
            if (this.openFileLayoutDisplayFlag) {
                this.openFileLayoutDisplayFlag = false;
                this.fileSelectLayoutDisplayFlag = true;
                return;
            }

            if (this.fileSelectLayoutDisplayFlag) {
                this.fileSelectLayoutDisplayFlag = false;
                this.mainWindowDisplayFlag = true;
                return;
            }

            if (this.moveLayoutDisplayFlag) {
                this.moveLayoutDisplayFlag = false;
                this.mainWindowDisplayFlag = true;
                return;
            }


        },
        moveButtonClick() {
            this.openFileLayoutDisplayFlag = false;
            this.fileSelectLayoutDisplayFlag = false;
            this.mainWindowDisplayFlag = false;
            this.moveLayoutDisplayFlag = true;
        },
        toMainWindow() {
            this.closeEverything();
            this.mainWindowDisplayFlag = true;
        },
        closeEverything() {
            this.mainWindowDisplayFlag = false
            this.fileSelectLayoutDisplayFlag = false
            this.openFileLayoutDisplayFlag = false
            this.moveLayoutDisplayFlag = false
            this.inputLayoutDisplayFlag = false
        },
        showInputLayout(coordName) {
            this.coordNameForInputLayout = coordName;
            this.inputLayoutDisplayFlag = true;
        },
        tempMethod() {
            console.log(this.modelInfoForMoveLayout)
        }
    }
}
</script>

<style lang="scss"></style>
