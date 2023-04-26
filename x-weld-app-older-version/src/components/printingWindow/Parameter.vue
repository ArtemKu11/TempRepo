<template>
    <div @click.prevent="clickHandler" class="parameter-info" :class="{ 'active': modelValue }">
        <div class="custom-checkbox">
            <div class="checkbox-point"></div>
        </div>
        <span>{{ name }}</span>
    </div>
</template>


<script lang="ts">
import { Prop, Component, Vue, Model, VModel } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class Parameter extends Vue {
    @Prop()
    name!: string

    @Model('update:modelValue', { type: Boolean })
    modelValue!: boolean

    clickHandler() {
        if (this.modelValue) {
            this.$emit('update:modelValue', false)
        } else {
            this.$emit('update:modelValue', true)
        }
    }
}
</script>

<style lang="scss">
.parameter-info.active {
    .custom-checkbox {
        .checkbox-point {
            align-self: flex-end;
            background: #D9D9D9 !important;
            box-shadow: 0px 0px 10px #FFFFFF !important;
        }
    }

    span {
        color: white !important;
    }
}
</style>