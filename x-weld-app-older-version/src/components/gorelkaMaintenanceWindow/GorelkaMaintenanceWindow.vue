<template>
    <div class="content-container gorelka-maintenance">
        <div id="content-header">
            <div class="left-header">Обслуживание горелки</div>
            <div class="center-header"></div>
            <div class="right-header">
                <div><img src="@/layouts/maintenance_screen/img/weld-icon.png"></div>
                <div>X {{ coordinatesHolder[0] }}</div>
                <div>Y {{ coordinatesHolder[1] }}</div>
                <div>Z {{ coordinatesHolder[2] }}</div>
            </div>

        </div>
        <div id="content-center">
            <div class="button-container">
                <button class="get-back-button">
                    <div class="picture-container">
                        <img src="@/layouts/maintenance_screen/img/get-back.png">
                    </div>
                    <span>Подача назад</span>
                </button>
            </div>

            <div class="button-container">
                <button class="gas-test-button">
                    <div class="picture-container">
                        <img src="@/layouts/maintenance_screen/img/gas-test.png">
                    </div>
                    <span>GAS тест</span>
                </button>
            </div>

            <div class="button-container">
                <button class="arc-test-button">
                    <div class="picture-container">
                        <img src="@/layouts/maintenance_screen/img/arc-test.png">
                    </div>
                    <span>ARC тест</span>
                </button>
            </div>

            <div class="button-container">
                <button class="get-forward-button">
                    <div class="picture-container">
                        <img src="@/layouts/maintenance_screen/img/get-forward.png">
                    </div>
                    <span>Подача вперед</span>
                </button>
            </div>

            <div class="button-container">
                <button class="zone-of-service-button">
                    <div class="picture-container">
                        <img src="@/layouts/maintenance_screen/img/zone-of-service.png">
                    </div>
                    <span>Зона обслуживания</span>
                </button>
            </div>

            <div class="button-container">
                <button class="error-drop-button">
                    <div class="picture-container">
                        <img src="@/layouts/maintenance_screen/img/error-drop.png">
                    </div>
                    <span>Сброс ошибок</span>
                </button>
            </div>

        </div>
        <div id="content-footer"></div>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class GorelkaMaintenanceWindow extends Vue {
    get coordinatesHolder(): number[] {
        return this.$store.getters['ourExtension/layoutsData/moveWindow/getCoordinates']()
    }
}
</script>


<style lang="scss" scoped>
@import "@/layouts/base_layout/css/base_layout.scss";

.content-container.gorelka-maintenance {
    margin-left: 110px;
    height: 100%;
    display: grid;
    grid-column: 1/3;
    grid-template-rows: 60px auto 60px;
    overflow-y: auto;

    button {
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        -webkit-tap-highlight-color: transparent;
    }

    .button-container {
        display: flex;
        justify-content: center;
        align-content: center;
        text-align: center;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 25px;
        color: #C7C7C7;
    }

    .button-container button {
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

    .button-container button img {
        pointer-events: none;

    }

    .button-container button span {
        padding-top: 15px;
        display: block;
        color: rgb(199, 199, 199);
    }

    .picture-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 192px;
        width: 191px;
    }

    #content-header {
        display: flex;
        align-items: center;
        justify-content: end;
        margin-right: 40px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 25px;
        color: #C7C7C7;
    }

    .left-header {
        width: 340px;
        padding-left: 40px;
    }

    .center-header {
        flex: 1;
    }

    .right-header {
        width: 400px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 25px;
        color: #C7C7C7;
    }

    #content-center {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        // column-gap: 160px;
        margin-left: 100px;
        margin-right: 100px;

    }

    .get-back-button:active img {
        content: url("@/layouts/maintenance_screen/img/get-back-active.png");
    }

    .get-back-button:active span {
        color: white;
    }

    .get-forward-button:active img {
        content: url("@/layouts/maintenance_screen/img/get-forward-active.png");
    }

    .get-forward-button:active span {
        color: white;
    }

    .gas-test-button:active img {
        content: url("@/layouts/maintenance_screen/img/gas-test-active.png");
    }

    .gas-test-button:active span {
        color: white;
    }

    .arc-test-button:active img {
        content: url("@/layouts/maintenance_screen/img/arc-test-active.png");
    }

    .arc-test-button:active span {
        color: white;
    }

    .zone-of-service-button:active img {
        content: url("@/layouts/maintenance_screen/img/zone-of-service-active.png");
    }

    .zone-of-service-button:active span {
        color: white;
    }

    .error-drop-button:active img {
        content: url("@/layouts/maintenance_screen/img/error-drop-active.png");
    }

    .error-drop-button:active span {
        color: white;
    }
}
</style>