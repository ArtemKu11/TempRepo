<template>
    <div class="log-holder">
        <span>{{ time }}</span>
        <span @mouseover="moveHandler" @click="clickHandler" v-html="consoleEntry.message" class="command-holder"
            :class="{ active: pointerFlag }"></span>
    </div>
</template>


<script lang="ts">
import { ConsoleEntry } from '@/store/console/types';
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component({})
export default class LogHolder extends Vue {
    @Prop({ default: "" })
    consoleEntry!: ConsoleEntry

    pointerFlag = false


    get time(): string {
        const unixTime = this.consoleEntry.time;
        if (unixTime) {
            return this.convertToHumanTime(new Date(unixTime * 1000))
        } else {
            return "--:--:--"
        }
    }

    convertToHumanTime(jsTime: Date): string {
        let hours = jsTime.getHours() + "";
        let minutes = jsTime.getMinutes() + "";
        if (hours.length === 1) {
            hours = "0" + hours;
        }
        if (minutes.length === 1) {
            minutes = "0" + minutes;
        }
        let seconds = jsTime.getSeconds() + "";
        if (seconds.length === 1) {
            seconds = "0" + seconds;
        }
        return `${hours}:${minutes}:${seconds}`
    }

    moveHandler() {
        if (this.consoleEntry.type === "command") {
            this.pointerFlag = true
        } else {
            this.pointerFlag = false
        }
    }

    clickHandler() {
        if (this.consoleEntry.type === "command") {
            this.$emit('clickOnCommand', this.consoleEntry.message)
        }
    }
}
</script>

<style lang="scss">
.command-holder.active {
    cursor: pointer;
}
</style>