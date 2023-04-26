<template>
    <!-- <div class="info-alert-container">
        <div @click="clickHandler" ref="infoAlert" class="info-alert" :class="{ 'green': green, 'red': red }">
            <span class="message-holder" v-html="infoAlert.message">
            </span>
        </div>
    </div> -->
    <div @click="clickHandler" ref="infoAlert" class="info-alert" :class="{ 'green': green, 'red': red }">
        <span class="message-holder" v-html="infoAlert.message">
            <!-- {{ infoAlert.message }} -->
        </span>
    </div>
</template>


<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { AlertType, InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types'

@Component({
    components: {

    },
})
export default class InfoAlert extends Vue {
    currentTimeout?: number

    get cancellationToken(): boolean {
        return this.$store.state.ourExtension.layoutsData.alerts.infoAlertState.cancellationToken
    }

    get infoAlert(): InfoAlertType {
        return this.$store.getters['ourExtension/layoutsData/alerts/getInfoAlert']()
    }

    set infoAlert(newValue: InfoAlertType | null) {
        this.$store.state.ourExtension.layoutsData.alerts.infoAlertState.currentMessage = newValue
    }

    get green(): boolean {
        return this.infoAlert.type?.toLowerCase() === 'green'
    }

    get red(): boolean {
        return this.infoAlert.type?.toLowerCase() === 'red'
    }

    @Watch('cancellationToken', { deep: true })
    cancellationTokenWather() {
        if (this.cancellationToken) {
            if (this.currentTimeout) {
                clearTimeout(this.currentTimeout)
            }
            this.infoAlert = null
        }

    }

    mounted() {
        this.showingAnimation()
    }



    showingAnimation() {
        const element = this.$refs.infoAlert as HTMLElement
        if (element) {
            const height = element.getBoundingClientRect().height;
            this.animationProcessing(element, height)
            let timeout = 5000
            if (this.infoAlert.time) {
                timeout = this.infoAlert.time
            }
            this.currentTimeout = setTimeout(this.closingAnimation, timeout)
        }
    }

    animationProcessing(element: HTMLElement, height: number) {
        if (height < 0) return
        element.style.top = -height + 'px';
        this.currentTimeout = setTimeout(() => {
            height = height - 2
            this.animationProcessing(element, height)
        }, 0)
    }

    closingAnimation() {
        const element = this.$refs.infoAlert as HTMLElement
        if (element) {
            const height = element.getBoundingClientRect().height;
            this.closingAnimationProcessing(element, 0, height)
        }
    }

    closingAnimationProcessing(element: HTMLElement, height: number, originalHeight: number) {
        height = height - 2
        if (height < -originalHeight) {
            this.infoAlert = null
            return
        }
        element.style.top = height + 'px';
        this.currentTimeout = setTimeout(() => {
            this.closingAnimationProcessing(element, height, originalHeight)
        }, 0)
    }

    clickHandler() {
        const alert: AlertType = {
            message: this.infoAlert.message,
            type: 'ok'
        }
        this.$store.dispatch('ourExtension/layoutsData/alerts/addToAlertQueue', alert)
    }
}
</script>


<style lang="scss">
.info-alert {
    z-index: 10;
    left: 20%;
    right: 20%;
    position: absolute;
    margin: 0 auto;
    padding: 20px 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(21, 21, 21, 0.9);
    border: 2px solid #6B6B6B;
    border-top: none;
    border-radius: 0px 0px 6px 6px;
    max-width: 60%;

    &.green {
        border-color: green;
    }

    &.red {
        border-color: red;
    }

    span {
        color: white;
        font-family: 'Arial';
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 29px;
        // text-align: center;
    }
}

// }
</style>