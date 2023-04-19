<template>
    <div ref="layersBar" class="layouts-holder">
        <span>Слои</span>
        <div class="layouts-icon-holder">
            <div class="layouts-icon">
                <div class="point up"></div>
                <div class="point down"></div>
            </div>
        </div>
        <button @click="openLayersSetup"><img src="@/layouts/profiles_layout/img/layouts_button.svg"></button>
    </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class LayersBar extends Vue {
    openLayersSetup() {
        this.$emit('openLayersSetup')
    }
}
</script>

