<template>
    <div class="content-container main-settings-window">
        <div class="content-header main-settings-window">
            <img class="xweld-logo" src="@/layouts/main_setting_screen/img/xweld_logo.png">
        </div>
        <div class="content-center main-settings-window">
            <div class="button-container">
                <button @click="clickHandler" class="settings-button">
                    <div class="picture-container">
                        <img src="@/layouts/main_setting_screen/img/settings_menu.svg">
                    </div>
                    <span>Настройки</span>
                </button>
            </div>

            <div class="button-container">
                <button @click="openGorelkaMaintenanceWindow" class="maintenance-button">
                    <div class="picture-container">
                        <img src="@/layouts/main_setting_screen/img/maintenance-menu.png">
                    </div>
                    <span>Обслуживание
                        горелки</span>
                </button>
            </div>

            <div class="button-container">
                <button @click="openConsoleWindow" class="console-button">
                    <div class="picture-container">
                        <img src="@/layouts/main_setting_screen/img/console-menu.png">
                    </div>
                    <span>Консоль</span>
                </button>
            </div>

            <div class="button-container-system">
                <button @click="openSystemInfoWindow" class="system-button">
                    <div class="system-picture-container">
                        <img src="@/layouts/main_setting_screen/img/system-menu.png">
                    </div>
                    <span>Система</span>
                </button>
            </div>

        </div>
        <div id="content-footer"></div>
    </div>
</template>


<script lang="ts">
import StateMixin from '@/mixins/state';
import { Component, Mixins, Vue } from 'vue-property-decorator';

@Component({})
export default class MainSettingsWindow extends Mixins(StateMixin) {
    openConsoleWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openConsoleWindow')
    }

    openGorelkaMaintenanceWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openGorelkaMaintenanceWindow')
    }

    openSystemInfoWindow() {
        this.$store.dispatch('ourExtension/windowFlags/openSystemInfoWindow')
    }

    clickHandler() {
        console.log(this.$store.getters['notifications/getNotifications'])
        console.log(this.hasWarnings, this.klippyConnected, this.klippyReady, this.klippyState)
    }
}
</script>


<style lang="scss" scoped>
.button-container,
.button-container-system {
    display: flex;
    justify-content: center;
    align-content: center;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 25px;
    color: #C7C7C7;
}

.button-container button,
.button-container-system button {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-tap-highlight-color: transparent;
    background: none;
    border: none;
    cursor: pointer;
    user-select: none;
    text-align: center;
    font-size: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.button-container button img,
.button-container-system button img {
    pointer-events: none;

}

.button-container button span {
    padding-top: 15px;
    display: block;
    color: rgb(199, 199, 199);
}

.button-container-system button span {
    padding-top: 18px;
    display: block;
    color: rgb(199, 199, 199);
}

.settings-button:active img {
    content: url("@/layouts/main_setting_screen/img/settings-menu-active.png");
}

.settings-button:active span {
    color: white;
}

.maintenance-button {
    width: 200px;
    margin-top: 23px;
}

.maintenance-button:active img {
    content: url("@/layouts/main_setting_screen/img/maintenance-menu-active.png");
}

.maintenance-button:active span {
    color: white;
}

.console-button:active img {
    content: url("@/layouts/main_setting_screen/img/console-menu-active.png")
}

.console-button:active span {
    color: white;
}

.system-button {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-tap-highlight-color: transparent;
    width: 200px;
    margin-left: 20px;
    margin-bottom: 23px;
}

.system-button span {
    margin-top: 13px;
    margin-right: 10px;
}

.system-button:active img {
    content: url("@/layouts/main_setting_screen/img/system-menu-active.png")
}

.system-button:active span {
    color: white;
}

.picture-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 192px;
    width: 191px;
}

.system-picture-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 192px;
    width: 191px;
    padding-top: 15px
}


.content-container.main-settings-window {
    margin-left: 110px;
    height: 100%;
    display: grid;
    grid-column: 1/3;
    grid-template-rows: 60px auto 60px;
    overflow-y: auto;
}

.content-header.main-settings-window {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-right: 40px;
}

.content-center.main-settings-window {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    column-gap: 160px;
    margin-left: 200px;
    margin-right: 200px;
}
</style>