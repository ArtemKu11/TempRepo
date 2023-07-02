<template>
    <div class="big-round-button-wrapper">
        <button class="big-round-button">
            <span class="percent">{{ printProgress }}%</span>
            <svg>
                <defs>
                    <linearGradient id="grad1">
                        <stop offset="0%" stop-color="rgba(0, 178, 202, 1)" />
                        <stop offset="100%" stop-color="rgba(4, 112, 200, 1)" stop-opacity="1" />
                    </linearGradient>
                </defs>
                <circle ref="circleBar" transform="rotate(-90 176 176)" stroke-dasharray="423.9 518.1" cx="176" cy="176"
                    r="150" stroke="url(#grad1)" stroke-width="7px" fill="transparent">
                </circle>
            </svg>
        </button>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class CircleBar extends Vue {
    mounted() {
        const progress = this.printProgress
        const circleBar = this.$refs.circleBar as SVGElement
        if (circleBar) {
            this.setPercent(progress, circleBar)
        }
    }

    get printProgress(): number {  // В процентах
        let progress = this.$store.getters['printer/getPrintProgress']
        progress = +(progress * 100).toFixed(0)

        const circleBar = this.$refs.circleBar as SVGElement
        if (circleBar) {
            this.setPercent(progress, circleBar)
        }
        return progress
    }

    setPercent(percent: number, circleBar: SVGElement) {
        const circleLength = 2 * Math.PI * 130
        const progressPercent = circleLength * percent / 100
        const probelPercent = circleLength - progressPercent
        circleBar.style.strokeDasharray = `${progressPercent} ${probelPercent}`
    }
}
</script>