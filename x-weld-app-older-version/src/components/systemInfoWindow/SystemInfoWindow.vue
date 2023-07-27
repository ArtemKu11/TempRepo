<template>
    <div class="content-container system-info">
        <div class="system-screen-rows">
            <div class="screen-name">Информация о системе</div>
            <div class="xweld-logo"><img class="xweld-logo-img" src="@/layouts/system_info_screen/img/xweld_logo.png"></div>
            <div class="system-info-placeholder">
                <span>Сеть: {{ ipAddressesString }}</span>
                <button @click="refreshWindow" class="refresh-button"><span>Обновить</span></button>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import StateMixin from '@/mixins/state';
import { Component, Mixins, Vue } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class SystemInfoWindow extends Mixins(StateMixin) {
    get ipAddressesString() {
        const arr = this.ipAddresses
        return arr.join(' ')
    }

    refreshWindow() {
        location.reload()
    }

}
</script>


<style lang="scss">
@import "@/layouts/base_layout/css/base_layout.scss";

.content-container.system-info {
    margin-left: 110px;
    height: 100%;
    display: grid;
    grid-column: 1/3;
    overflow-y: auto;


    .system-screen-rows {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: left;
        justify-content: center;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 20px;
        color: #C7C7C7;
        padding-top: 10px;
    }

    .screen-name {
        height: 65px;
        padding-left: 40px;
        padding-top: 15px;
        padding-bottom: 20px;
    }

    .xweld-logo {
        height: 50px;
        padding-left: 40px;
        padding-top: 3px;

    }

    .system-info-placeholder {
        flex: 1;
        padding-top: 10px;
        padding-left: 40px;
        display: flex;
        flex-direction: column;
        gap: 50px;


        button {
            display: block;
            background: none;
            border: none;
            border: 2px solid gray;
            border-radius: 6px;
            width: 200px;
            height: 50px;
            cursor: pointer;
            user-select: none;
            margin-bottom: 20px;

            span {
                color: white;
                font-size: 20px;
            }

            &:active {
                border-color: white;
            }
        }
    }
}
</style>