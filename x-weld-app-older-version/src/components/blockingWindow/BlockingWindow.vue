<template>
    <div @click="clickHandler" class="blocking-window">

    </div>
</template>


<script lang="ts">
import { Alerts } from '@/store/ourExtension/layoutsData/alerts/helpers';
import { InfoAlertType } from '@/store/ourExtension/layoutsData/alerts/types';
import { Component, Mixins, Vue } from 'vue-property-decorator';
import WindowsMixin from '@/mixins/windows';



@Component({
    components: {

    },
})
export default class BlockingWindow extends Mixins(WindowsMixin) {
    clickHandler() {
        this.screenIsBlockingAlert()
    }
}
</script>


<style lang="scss">
@import "@/layouts/base_layout/css/base_layout.scss";


.blocking-window {
    z-index: 4;
    // background: rgba(21, 21, 21, 0.9);
    position: absolute;
    // height: 100%;
    // width: 100%;
    left: $sidebarWidth;
    right: 0px;
    bottom: 0px;
    top: 0px
}
</style>