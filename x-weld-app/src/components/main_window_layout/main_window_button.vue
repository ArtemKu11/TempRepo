<template>
    <button @click="$emit('mainWindowButtonClick', buttonData.buttonName)">
        <img :src="buttonData.buttonImage">
        <span>{{ buttonData.buttonName }}</span>
    </button>
</template>

<script>
export default {
    name: "MainWindowButton",
    props: {
        buttonData: {
            type: Object,
            required: true
        }
    },
    components: {},
    data() {
        return {
            value: '@/layouts/main_window_layout/img/config_icon.png'
        }
    }
}
</script>