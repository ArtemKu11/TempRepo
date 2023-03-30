<template>
    <div id="file-select-container">
        <div id="file-select-content-container">
            <div id="file-select-header">
                <button @click="$emit('goHome')" id="home-button"><img
                        src="@/layouts/main_window_layout/img/home_icon.png"></button>
                <button id="models-for-print-button">Модели для печати</button>
                <button id="points-button"><img src="@/layouts/main_window_layout/img/points_icon.png"></button>
            </div>
            <div id="file-select-center">

                <UpperLevelButton />
                <FolderButton />
                <FileButton v-for="fileData of filesList" :fileData="fileData" @firstClick="firstClickHandler" @secondClick="secondClickHandler"/>



            </div>
            <div id="file-select-footer"></div>
        </div>
    </div>
</template>

<script>
import UpperLevelButton from "@/components/main_window_layout/upper_level_button_click.vue"
import FolderButton from "@/components/main_window_layout/folder_button.vue"
import FileButton from "@/components/main_window_layout/file_button.vue"


export default {
    name: "FileSelectWindow",
    components: { UpperLevelButton, FolderButton, FileButton },
    data() {
        return {
            filesList: [
                {
                    fileId: 0,
                    isActive: false
                },
                {
                    fileId: 1,
                    isActive: false
                },
                {
                    fileId: 2,
                    isActive: false
                },
                {
                    fileId: 3,
                    isActive: false
                },
                {
                    fileId: 4,
                    isActive: false
                },
                {
                    fileId: 5,
                    isActive: false
                }
            ]
        }
    },
    methods: {
        firstClickHandler(fileData) {
            let requiredId = fileData.fileId;
            let requiredFlag = !fileData.isActive;
            for (let item of this.filesList) {
                if (item.fileId === requiredId) {
                    item.isActive = requiredFlag;
                } else {
                    item.isActive = false;
                }
            }

        },
        secondClickHandler(fileData) {
            this.$emit('openFile', fileData);
        }
    }
}
</script>