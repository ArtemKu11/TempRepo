<template>
    <button @click="this.$emit('click')" ><img src="@/layouts/move_layout/img/keyboard_button.svg" /></button>
</template>

<script>
export default {
    name: "KeyboardButton"
}
</script>