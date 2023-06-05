<template>
    <div class="content-container gorelka-maintenance">
        <div id="content-header">
            <div class="left-header">Обслуживание горелки</div>
            <div class="center-header"></div>
            <div class="right-header">
                <div><img src="@/layouts/maintenance_screen/img/weld-icon.png"></div>
                <div>X {{ fixedCoordinatesHolder[0] }}</div>
                <div>Y {{ fixedCoordinatesHolder[1] }}</div>
                <div>Z {{ fixedCoordinatesHolder[2] }}</div>
            </div>

        </div>
        <div id="content-center">
            <div class="button-container">
                <button @touchstart="feedBackStart" @touchend="feedBackEnd" class="get-back-button">
                    <div class="picture-container">
                        <img src="@/layouts/maintenance_screen/img/get-back.png">
                    </div>
                    <span>Подача назад</span>
                </button>
            </div>

            <div class="button-container">
                <button @touchstart="gasTestStart" @touchend="gasTestEnd" class="gas-test-button">
                    <div class="picture-container">
                        <img src="@/layouts/maintenance_screen/img/gas-test.png">
                    </div>
                    <span>GAS тест</span>
                </button>
            </div>

            <div class="button-container">
                <button @touchstart="arcTestStart" @touchend="arcTestEnd" class="arc-test-button">
                    <div class="picture-container">
                        <img src="@/layouts/maintenance_screen/img/arc-test.png">
                    </div>
                    <span>ARC тест</span>
                </button>
            </div>

            <div class="button-container">
                <button @touchstart="feedForwardStart" @touchend="feedForwardEnd" class="get-forward-button">
                    <div class="picture-container">
                        <img src="@/layouts/maintenance_screen/img/get-forward.png">
                    </div>
                    <span>Подача вперед</span>
                </button>
            </div>

            <div class="button-container">
                <button @touchstart="maintenanceArea" class="zone-of-service-button">
                    <div class="picture-container">
                        <img src="@/layouts/maintenance_screen/img/zone-of-service.png">
                    </div>
                    <span>{{ maintenanceAreaText }}</span>
                </button>
            </div>

            <div class="button-container">
                <button @touchstart="resetWarnings" class="error-drop-button">
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
import StateMixin from '@/mixins/state';
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers';
import { InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class GorelkaMaintenanceWindow extends Mixins(StateMixin) {
    

    get lastCoords(): number[] {
        return this.$store.getters['ourExtension/layoutsData/settingsWindow/getLastCoords']
    }

    get maintenanceFlag(): boolean {
        return this.$store.getters['ourExtension/layoutsData/settingsWindow/getMaintenanceFlag']
    }

    get maintenanceAreaText(): string {
        if (this.maintenanceFlag) {
            return "Вернуть в исходное"
        } else {
            return "Зона обслуживания"
        }
    }

    @Watch("coordinatesHolder", {deep: true})
    coordinatesHolderWatcher() {
        this.resolveMaintenanceFlag()
    }

    mounted() {
        this.resolveMaintenanceFlag()
    }

    resolveMaintenanceFlag() {
        const [currentX, currentY, currentZ] = this.coordinatesHolder
        if (currentX === 500 && currentY === 0) {
            this.$store.dispatch('ourExtension/layoutsData/settingsWindow/setMaintenanceFlag', true)
        } else {
            this.$store.dispatch('ourExtension/layoutsData/settingsWindow/setMaintenanceFlag', false)
        }
    }

    feedForwardStart() {
        this.sendGcode('MEGMEET_WIRE_FORWARD_START')
        const alert: InfoAlertType = {
            message: 'Запрошена подача вперед',
            type: 'green',
            time: 1500
        }
        Alerts.showInfoAlert(alert)
    }

    feedForwardEnd() {
        this.sendGcode('MEGMEET_WIRE_FORWARD_END')
        const alert: InfoAlertType = {
            message: 'Подача вперед завершена',
            type: 'green',
            time: 1500
        }
        Alerts.showInfoAlert(alert)
    }

    feedBackStart() {
        this.sendGcode('MEGMEET_WIRE_REVERSE_START')
        const alert: InfoAlertType = {
            message: 'Запрошена подача назад',
            type: 'green',
            time: 1500
        }
        Alerts.showInfoAlert(alert)
    }

    feedBackEnd() {
        this.sendGcode('MEGMEET_WIRE_REVERSE_END')
        const alert: InfoAlertType = {
            message: 'Подача назад завершена',
            type: 'green',
            time: 1500
        }
        Alerts.showInfoAlert(alert)
    }

    gasTestStart() {
        this.sendGcode('MEGMEET_GAS_START')
        const alert: InfoAlertType = {
            message: 'Запрошен GAS тест',
            type: 'green',
            time: 1500
        }
        Alerts.showInfoAlert(alert)
    }

    gasTestEnd() {
        this.sendGcode('MEGMEET_GAS_END')
        const alert: InfoAlertType = {
            message: 'Завершен GAS тест',
            type: 'green',
            time: 1500
        }
        Alerts.showInfoAlert(alert)
    }

    arcTestStart() {
        this.sendGcode('MEGMEET_ARC_START')
        const alert: InfoAlertType = {
            message: 'Запрошен ARC тест',
            type: 'green',
            time: 1500
        }
        Alerts.showInfoAlert(alert)
    }

    arcTestEnd() {
        this.sendGcode('MEGMEET_ARC_END')
        const alert: InfoAlertType = {
            message: 'Завершен ARC тест',
            type: 'green',
            time: 1500
        }
        Alerts.showInfoAlert(alert)
    }

    maintenanceArea() {
        if (this.maintenanceFlag) {
            if (this.lastCoords.length) {
                // this.$store.dispatch('ourExtension/layoutsData/settingsWindow/setMaintenanceFlag', false)
                this.moveToSourcePosition()
            } else {
                this.showErrorAlert()
            }
        } else {
            this.$store.dispatch('ourExtension/layoutsData/settingsWindow/setLastCoords', JSON.parse(JSON.stringify(this.coordinatesHolder)))
            // this.$store.dispatch('ourExtension/layoutsData/settingsWindow/setMaintenanceFlag', true)
            this.moveToMaintenancePosition()
        }
        
    }

    moveToMaintenancePosition() {
        this.sendGcode('G1 x500 y0 f6000')
        const alert: InfoAlertType = {
            message: 'Выполняется перемещение в зону обслуживания',
            type: 'green',
            time: 1500
        }
        Alerts.showInfoAlert(alert)
    }

    moveToSourcePosition() {
        this.sendGcode(`G1 x${this.lastCoords[0]} y${this.lastCoords[1]} f6000`)
        const alert: InfoAlertType = {
            message: 'Выполняется перемещение в исходную позицию',
            type: 'green',
            time: 1500
        }
        Alerts.showInfoAlert(alert)
    }

    showErrorAlert() {
        const alert: InfoAlertType = {
            message: 'Ошибка! Не найдена исходная позиция',
            type: 'red',
            time: 1500
        }
        Alerts.showInfoAlert(alert)
    }

    resetWarnings() {
        this.sendGcode('MEGMEET_ERROR_RESET')
        const alert: InfoAlertType = {
            message: 'Сброс ошибок выполнен!',
            type: 'green',
            time: 1500
        }
        Alerts.showInfoAlert(alert)
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
        width: 400px;
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