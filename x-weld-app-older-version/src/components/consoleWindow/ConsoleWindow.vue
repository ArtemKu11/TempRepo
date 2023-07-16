<template>
    <div class="content-container normal-console-layout">
        <div ref="consoleLogsHolder" class="console-logs-holder">
            <LogHolder @clickOnCommand="clickOnCommandHolder" v-for="(entry, index) in consoleEntries" :key="index"
                :consoleEntry="entry" />
        </div>
        <div class="input-wrapper">
            <input @click="clickOnInput" ref="input" @keypress="submitHandler" @input="onInputChange" :value="inputValue"
                type="text" placeholder="Введите команду">
        </div>
        <div v-if="keyboardFlag" class="keyboard-wrapper">
            <SimpleKeyboard @onChange="onChange" @onKeyPress="onKeyPress"
                :input="inputValue" :theme="'hg-theme-default myTheme1'" />
        </div>
        <!-- <div class="keyboard"></div> -->
    </div>
</template>


<script lang="ts">
import LogHolder from './LogHolder.vue';
import { Component, Vue, Mixins, Prop, Watch, Model } from 'vue-property-decorator';
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
    @Model('update:modelValue', { type: Boolean })
    modelValue!: boolean

    inputValue = ''
    logs: Array<string> = []
    keyboardFlag = false;
    keyboardClickTimeout: null | number = null
    maxConsoleEntriesCount = 20

    get consoleEntries(): Array<ConsoleEntry> {
        setTimeout(() => this.scrollToLatest(), 200)
        let entries = this.$store.getters['console/getConsoleEntries'] as Array<ConsoleEntry>
        if (entries.length > 20) {
            entries = entries.slice(-this.maxConsoleEntriesCount)
        }
        return entries
    }

    @Watch('modelValue', { deep: true })
    backClickWatcher() {
        if (this.modelValue) {
            if (this.keyboardFlag) {
                this.keyboardFlag = false
                this.$emit('update:modelValue', false)
            } else {
                this.$emit('update:modelValue', false)
                this.$store.dispatch('ourExtension/windowFlags/openPreviousWindow');
            }
        }
    }

    mounted() {
        this.scrollToLatest();
    }

    onChange(input: string) {
        this.inputValue = input;
    }

    onKeyPress(button: string) {
        if (button === '{enter}') {
            this.submit()
        }
    }

    onInputChange(input: Event) {
        const target = input.target as HTMLInputElement
        if (target) {
            this.inputValue = target.value
        }
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
        this.keyboardFlag = true
        setTimeout(() => {
            if (this.keyboardFlag) {
                this.scrollToLatest()
            }
        }, 200)
    }

    focusOnInput() {
        const input = this.$refs.input as HTMLElement
        if (input) {
            input.focus()
        }
    }
}
</script>


<style lang="scss">
@import '@/layouts/console_window_layout/css/console_window_layout.scss';
</style>