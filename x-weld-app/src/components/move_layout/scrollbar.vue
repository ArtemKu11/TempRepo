<template>
    <div id="scrollbar-container">
        <span>Шаг (мм)</span>
        <input type="range" :value="scrollbarValue" step="0.5" @change="changeScrollbarValueHandler">
        <div id="values">
            <span>0,1</span>
            <span>0,5</span>
            <span>1,0</span>
            <span>2,0</span>
            <span>5,0</span>
            <span>10,0</span>
            <span>50,0</span>
        </div>

    </div>
</template>

<script>
export default {
    name: "Scrollbar",
    props: ['modelValue'],  
    emits: ['update:modelValue'],
    data() {
        return {
            scrollbarValue: 33.5,
            valueConstants: [0, 17, 33.5, 50, 66.5, 83.5, 100],
            valueSteps: [0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 50.0]
        }
    },
    mounted() {
        let nearIndex = this.findNearIndex(this.modelValue, this.valueSteps);
        this.scrollbarValue = this.valueConstants[nearIndex];
    }, 
    methods: {
        changeScrollbarValueHandler(e) {
            let newValue = e.target.value;
            let nearIndex = this.findNearIndex(newValue, this.valueConstants);

            this.scrollbarValue = this.valueConstants[nearIndex] + 1;
            this.scrollbarValue = this.valueConstants[nearIndex];
            this.$emit('update:modelValue', this.valueSteps[nearIndex]);
        },

        findNearIndex(value, array) {
            let minDiff = 100;
            let minIndex = 0;
            array.forEach((constValue, index) => {
                let diff = Math.abs(constValue - value);
                if (diff < minDiff) {
                    minDiff = diff;
                    minIndex = index;
                }
            })
            return minIndex;
        }
    }
}
</script>