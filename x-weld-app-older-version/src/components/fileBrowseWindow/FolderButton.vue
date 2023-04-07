<template>
    <div class="wrapper">
        <button class="folder-button">
            <div class="info-holder">
                <img src="@/layouts/main_window_layout/img/folder.png">
                <span>Модели новые 123</span>
                <div class="file-info">
                    <span>Дата: 03.03.2023</span>
                    <span>Размер: 347kb</span>
                    <span>Время печати: 15h 21m</span>
                </div>
            </div>
        </button>
        <hr />
    </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class FolderButton extends Vue {

}
</script>