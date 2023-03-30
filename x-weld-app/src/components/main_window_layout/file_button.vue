<template>
    <div class="file-button" :class="{ active:fileData.isActive}" @click="$emit('firstClick', fileData)">
        <div class="info-holder">
            <img src="@/layouts/main_window_layout/img/disabled_checkbox.png">
            <span>3D_Printer_test_fixed_stl_3rd_gen...</span>
            <div class="file-info">
                <span>Дата: 03.03.2023</span>
                <span>Размер: 347kb</span>
                <span>Время печати: 15h 21m</span>
            </div>
        </div>
        <button @click="$emit('secondClick', fileData)">Открыть</button>
    </div>
    <hr />
</template>

<script>
export default {
    name: "FileButton",
    props: {
        fileData: {
            type: Object,
            required: true
        }
    },  
    emits: ['firstClick', 'secondClick'],    
}
</script>

<style lang="scss">
.file-button.active {
    .info-holder {
        span {
            color: white !important;
        }

        img {
            content: url('@/layouts/main_window_layout/img/checked_checkbox.png');
        }
    }

    button {
        display: block !important;
    }

}
</style>