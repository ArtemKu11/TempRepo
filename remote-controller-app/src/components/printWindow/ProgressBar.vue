<template>
    <div class="progress-wrapper">
        <div ref="progressBar" class="progress"></div>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class ProgressBar extends Vue {
    mounted() {
        setTimeout(() => {
            const progress = this.printProgress
            const progressBar = this.$refs.progressBar as HTMLElement
            if (progressBar) {
                this.setProgressBarPercent(progress, progressBar)
            }
        }, 100)

    }

    get printProgress(): number {  // В процентах
        let progress = this.$store.getters['printer/getPrintProgress']
        progress = +(progress * 100).toFixed(0)

        const progressBar = this.$refs.progressBar as HTMLElement
        if (progressBar) {
            this.setProgressBarPercent(progress, progressBar)
        }
        return progress
    }

    setProgressBarPercent(percent: number, progressBar: HTMLElement) {
        progressBar.style.width = `${percent}%`
    }
}
</script>