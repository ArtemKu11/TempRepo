<template>
    <div class="file-select-window">
        <div class="header">
            <div class="a-icon">a</div>
            <span>Прокрутка файлов</span>
        </div>

        <div class="files-wrapper">
            <button class="upper-folder">
                <div class="description">
                    <img src="@/style/fileSelectWindow/img/upper_folder.svg" alt="">
                    <span>..</span>
                </div>
                <hr>
            </button>

            <div class="files-list">
                <button class="file-union-button">
                    <div class="description">
                        <img src="@/style/fileSelectWindow/img/folder_button.svg" alt="">
                        <span class="name">Модели новые 123</span>
                    </div>
                    <hr>
                </button>

                <button class="file-union-button">
                    <div class="description">
                        <img src="@/style/fileSelectWindow/img/small_cube.svg" alt="">
                        <span class="name">3D_Printer_test_fixed_stl_3rd_gen...</span>
                    </div>
                    <hr>
                </button>

                <button class="file-union-button active">
                    <div class="description">
                        <img src="@/style/fileSelectWindow/img/big_cube.svg" alt="">
                        <span class="name">3D_Printer_test_fixed_stl_3rd_gen...</span>
                        <div class="meta-info">
                            <span class="date">Дата: 03.03.2023</span>
                            <span class="size">Размер: 347kb</span>
                            <span class="print-time">Время печати: 15h 21m</span>
                        </div>

                    </div>
                    <hr>
                </button>

                <button class="file-union-button">
                    <div class="description">
                        <img src="@/style/fileSelectWindow/img/small_cube.svg" alt="">
                        <span class="name">3D_Printer_test_fixed_stl_3rd_gen...</span>
                    </div>
                    <hr>
                </button>

                <button class="file-union-button">
                    <div class="description">
                        <img src="@/style/fileSelectWindow/img/small_cube.svg" alt="">
                        <span class="name">3D_Printer_test_fixed_stl_3rd_gen...</span>
                    </div>
                    <hr>
                </button>

                <button class="file-union-button">
                    <div class="description">
                        <img src="@/style/fileSelectWindow/img/small_cube.svg" alt="">
                        <span class="name">3D_Printer_test_fixed_stl_3rd_gen...</span>
                    </div>
                    <hr>
                </button>

                <button class="file-union-button">
                    <div class="description">
                        <img src="@/style/fileSelectWindow/img/small_cube.svg" alt="">
                        <span class="name">3D_Printer_test_fixed_stl_3rd_gen...</span>
                    </div>
                    <hr>
                </button>

                <button class="file-union-button">
                    <div class="description">
                        <img src="@/style/fileSelectWindow/img/small_cube.svg" alt="">
                        <span class="name">3D_Printer_test_fixed_stl_3rd_gen...</span>
                    </div>
                    <hr>
                </button>

                <button class="file-union-button">
                    <div class="description">
                        <img src="@/style/fileSelectWindow/img/small_cube.svg" alt="">
                        <span class="name">3D_Printer_test_fixed_stl_3rd_gen...</span>
                    </div>
                    <hr>
                </button>

                <button class="file-union-button">
                    <div class="description">
                        <img src="@/style/fileSelectWindow/img/small_cube.svg" alt="">
                        <span class="name">3D_Printer_test_fixed_stl_3rd_gen...</span>
                    </div>
                    <hr>
                </button>

                <button class="file-union-button">
                    <div class="description">
                        <img src="@/style/fileSelectWindow/img/small_cube.svg" alt="">
                        <span class="name">3D_Printer_test_fixed_stl_3rd_gen...</span>
                    </div>
                    <hr>
                </button>
            </div>
        </div>

        <div class="control-buttons">
            <button class="control-button info">
                <div class="img-wrapper">
                    <img src="@/style/fileSelectWindow/img/info.svg" alt="">
                </div>
                <span>Информация о файле</span>
            </button>

            <button class="control-button profiles">
                <div class="img-wrapper">
                    <img src="@/style/fileSelectWindow/img/star.svg" alt="">
                </div>
                <span>Режимы наплавки</span>
            </button>

            <button class="control-button preprint">
                <div class="img-wrapper">
                    <img src="@/style/fileSelectWindow/img/settings.svg" alt="">
                </div>
                <span>Допечатная подготовка</span>
            </button>

            <button @click="openPrint" class="control-button revert select">
                <span>Выбор</span>
                <div class="img-wrapper">
                    <img src="@/style/fileSelectWindow/img/select.svg" alt="">
                </div>
            </button>

            <button class="control-button revert cancel">
                <span>Отмена</span>
                <div class="img-wrapper">
                    <img src="@/style/fileSelectWindow/img/cancel.svg" alt="">
                </div>
            </button>

            <button class="control-button revert menu">
                <span>Главное меню</span>
                <div class="img-wrapper">
                    <img src="@/style/fileSelectWindow/img/menu.svg" alt="">
                </div>
            </button>
        </div>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class FileSelectWindow extends Vue {
    openPrint() {
        this.$store.dispatch('ourExtension/temp/openPrintWindow')
    }

    
}
</script>


<style lang="scss">
@import '@/style/fileSelectWindow/css/fileSelectWindow.scss';
</style>`