<template>
    <div class="content-container fatal-error-alert">
        <FatalSelectList :items="items" v-if="listFlag" @close="closeList" @selectItem="selectItem" />
        <div class="alert-holder">
            <span class="header">
                ФАТАЛЬНАЯ ОШИБКА!
            </span>
            <div class="message-holder" v-html="message">
            </div>
            <div class="buttons-holder fatal-error">
                <button @click="restart">Перезагрузить</button>

            </div>
        </div>
    </div>
</template>


<script lang="ts">
import FatalSelectList from './FatalSelectList.vue'
import ServicesMixin from '@/mixins/services';
import StateMixin from '@/mixins/state';
import WindowsMixin from '@/mixins/windows';
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers';
import { AlertType, InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { Prop, Component, Vue, Mixins } from 'vue-property-decorator';

@Component({
    components: {
        FatalSelectList
    },
})
export default class FatalErrorAlert extends Mixins(StateMixin, ServicesMixin, WindowsMixin) {

    items = ['Klipper', 'Прошивка', 'Moonraker', 'Интерфейс']
    listFlag = false

    get message(): string {
        // return(`Internal error during connect: Unknown error: HTTPConnectionPool(host='192.168.1.108', port=80): Max retries exceeded with url: /onvif/device_service (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f128dda1320>: Failed to establish a new connection: [Errno 101] Network is unreachable'))<br /><br />Once the underlying issue is corrected, use the "RESTART"<br />command to reload the config and restart the host software.<br />Printer is halted`)
        // console.log('MESSAGE')
        // console.log(this.klippyStateMessage)
        return this.klippyStateMessage
    }

    beforeDestroy() {
        this.closeList()
    }

    restartKlipper() {
        this.restartKlippy()
        const alert: InfoAlertType = {
            message: 'Отправлен запрос на перезагрузку Klipper',
            type: 'green'
        }
        Alerts.showInfoAlert(alert)
    }

    restartFirmware() {
        this.firmwareRestartKlippy()
        const alert: InfoAlertType = {
            message: 'Отправлен запрос на перезагрузку прошивки',
            type: 'green'
        }
        Alerts.showInfoAlert(alert)
    }

    restartMoonraker() {
        this.serviceRestartMoonraker()
        const alert: InfoAlertType = {
            message: 'Отправлен запрос на перезагрузку Moonraker',
            type: 'green'
        }
        Alerts.showInfoAlert(alert)
    }

    restartInterface() {
        location.reload()
    }

    restart() {
        this.listFlag = true
    }

    closeList() {
        this.listFlag = false

    }

    selectItem(selectedItem: string) {
        switch (selectedItem) {
            case 'Klipper':
                this.restartKlipper()
                break;
            case 'Прошивка':
                this.restartFirmware()
                break;
            case 'Moonraker':
                this.restartMoonraker()
                break;
            case 'Интерфейс':
                this.restartInterface()
                break;
        }
        this.closeList()
    }
}
</script>


<style lang="scss">
@import "@/style/baseLayout/css/base_layout.scss";

.content-container.fatal-error-alert {
    // min-height: $minHeight;
    position: absolute;
    top: 0px;
    z-index: 6;
    height: 100%;
    width: 100%;
    background: rgba(21, 21, 21, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
    min-width: 600px;

    span {
        color: white;
        font-family: 'Arial';
        font-style: normal;
        font-weight: 400;
        font-size: 25px;
        line-height: 29px;
    }

    button {
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        -webkit-tap-highlight-color: transparent;
    }

    .alert-holder {
        // background-color: black;
        background: rgba(0, 0, 0, 0.5);
        padding: 30px 40px;
        border-radius: 10px;
        border: 2px solid red;

        display: flex;
        flex-direction: column;
        // place-items: center;
        align-items: center;
        justify-content: center;
        max-width: 80%;

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .message-holder {
            text-align: center;
            color: white;
            font-family: 'Arial';
            font-style: normal;
            font-weight: 400;
            font-size: 25px;
            // line-height: 29px;
            line-height: 1.5;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .buttons-holder {
        margin-top: 30px;
        width: 100%;

        &.fatal-error {
            display: flex;
            flex-direction: column;
            align-items: center;

            button {
                display: block;
                background: none;
                border: none;
                cursor: pointer;
                width: 300px;
                height: 50px;
                border: 2px solid #6B6B6B;
                border-radius: 6px;
                font-size: 20px;
                color: white;

                &:active {
                    border: 2px solid white;
                }

                &:not(&:last-of-type) {
                    margin-bottom: 20px;
                }
            }
        }
    }


}
</style>