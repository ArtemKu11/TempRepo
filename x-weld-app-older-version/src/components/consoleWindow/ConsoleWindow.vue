<template>
    <div class="content-container normal-console-layout">
        <div ref="consoleLogsHolder" class="console-logs-holder">
            <LogHolder @clickOnCommand="clickOnCommandHolder" v-for="(entry, index) in consoleEntries" :key="index" :consoleEntry="entry" />
        </div>
        <div class="input-wrapper">
            <input ref="input" @keypress="submitHandler" v-model="inputValue" type="text" placeholder="Введите команду">
        </div>
    </div>
</template>


<script lang="ts">
import LogHolder from './LogHolder.vue';
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { ConsoleEntry } from '@/store/console/types';
import { SocketActions } from '@/api/socketActions';
import StateMixin from '@/mixins/state';

@Component({
    components: {
        LogHolder
    },
})
export default class ConsoleWindow extends Mixins(StateMixin) {
    inputValue = ''
    logs: Array<string> = []

    get consoleEntries(): Array<ConsoleEntry> {
        setTimeout(() => this.scrollToLatest(), 200)
        return this.$store.getters['console/getConsoleEntries']
    }

    mounted() {
        this.scrollToLatest();
    }

    scrollToLatest() {
        const holder = this.$refs.consoleLogsHolder as HTMLBaseElement;
        if (holder) {
            holder.scrollTop = holder.scrollHeight;
        }
    }

    submitHandler(e: KeyboardEvent) {
        if (e.key === 'Enter' && this.inputValue) {
            this.sendCommand(this.inputValue)
            this.inputValue = ''
        }
    }

    sendCommand(command?: string) {
        if (command && command.length) {
            // If clients detect M112 input from the console, we should invoke the emergency_stop endpoint
            if (command && command.trim().toLowerCase() === 'm112') {
                SocketActions.printerEmergencyStop()
            }
            this.sendGcode(command)
            this.inputValue = ''
        }
    }

    clickOnCommandHolder(command: string) {
        this.inputValue = command;
        const input = this.$refs.input as HTMLInputElement;
        if (input) {
            input.focus()
        }
    }

}
</script>


<style lang="scss">
@import '@/layouts/console_window_layout/css/console_window_layout.scss';
</style>