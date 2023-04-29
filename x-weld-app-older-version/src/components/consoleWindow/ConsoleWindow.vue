<template>
    <div class="content-container normal-console-layout">
        <div ref="consoleLogsHolder" class="console-logs-holder">
            <LogHolder @clickOnCommand="clickOnCommandHolder" v-for="(entry, index) in consoleEntries" :key="index"
                :consoleEntry="entry" />
        </div>
        <div class="input-wrapper">
            <input @click="clickOnInput" ref="input" @keypress="submitHandler" v-model="inputValue" type="text"
                placeholder="Введите команду">
        </div>
        <div v-if="keyboardFlag" class="keyboard-wrapper">
            <SimpleKeyboard @onChange="" @onKeyPress="virtualKeyboardClick" :theme="'hg-theme-default myTheme1'" />
        </div>
        <!-- <div class="keyboard"></div> -->
    </div>
</template>


<script lang="ts">
import LogHolder from './LogHolder.vue';
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { ConsoleEntry } from '@/store/console/types';
import { SocketActions } from '@/api/socketActions';
import StateMixin from '@/mixins/state';

import SimpleKeyboard from "./SimpleKeyboard.vue";


@Component({
    components: {
        LogHolder, SimpleKeyboard
    },
})
export default class ConsoleWindow extends Mixins(StateMixin) {
    inputValue = ''
    logs: Array<string> = []
    keyboardFlag = false;

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
        if (e.key === 'Enter') {
            this.submit()
        }
    }

    submit() {
        if (this.inputValue) {
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

    clickOnInput() {
        this.keyboardFlag = !this.keyboardFlag

        setTimeout(() => {
            if (this.keyboardFlag) {
                this.scrollToLatest()
            }
        }, 100)
    }

    virtualKeyboardClick(key: string) {
        switch (key) {
            case '{bksp}':
                this.deleteSymbol()
                break;
            case '{space}':
                this.spaceClick()
                break;
            case '{enter}':
                this.submit()
                break;
            default:
                this.symbolClick(key)
                break;
        }
        const input = this.$refs.input as HTMLElement
        if (input) {
            setTimeout(() => { input.focus() }, 100)
        }
    }

    deleteSymbol() {
        if (this.inputValue) {
            this.inputValue = this.inputValue.slice(0, -1)
        }
    }

    spaceClick() {
        this.inputValue += ' '
    }

    symbolClick(symbol: string) {
        if (!symbol.startsWith('{')) {
            this.inputValue += symbol
        }
    }

}
</script>


<style lang="scss">
@import '@/layouts/console_window_layout/css/console_window_layout.scss';
</style>