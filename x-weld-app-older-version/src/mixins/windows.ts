import { InitInputWindowData, InputWindowData } from '@/store/ourExtension/layoutsData/inputWindow/types'
import { SelectListInitData } from '@/store/ourExtension/layoutsData/selectListWindow/types'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class WindowsMixin extends Vue {
    openInputWindow(defaultImplementation: boolean, coordName: string, initValue: number, valcoderStep: number, dispachAfterConfirm?: string, callbackAfterConfirm?: Function,
        maxValue?: number, minValue?: number, rejectPointClick?: boolean, coordUnits?: string, isItTime?: boolean) {
        if (!dispachAfterConfirm) {
            dispachAfterConfirm = 'void'
        }

        const inputWindowData: InputWindowData = {
            coordName: coordName,
            initValue: initValue,
            dispachAfterConfirm: dispachAfterConfirm,
            callbackAfterConfirm: callbackAfterConfirm,
            maxValue: maxValue,
            minValue: minValue,
            rejectPointClick: rejectPointClick,
            coordUnits: coordUnits,
            isItTime: isItTime
        }
        const initInfo: InitInputWindowData = {
            inputWindowData: inputWindowData,
            valcoderStep: valcoderStep,
        }
        if (defaultImplementation) {
            this.$store.dispatch('ourExtension/layoutsData/inputWindow/initInputWindow', initInfo);
        } else {
            this.$store.dispatch('ourExtension/layoutsData/inputWindow/initNotDefaultInputWindow', initInfo);
        }
        this.$store.dispatch('ourExtension/windowFlags/openInputWindow');
    }

    openSelectWindowWithoutIcon(callback: Function, initList: string[]) {
        const initData: SelectListInitData = {
            callbackAfterConfirm: callback,
            initList: initList
        }


        this.$store.dispatch('ourExtension/layoutsData/selectListWindow/reset')
        this.$store.dispatch('ourExtension/layoutsData/selectListWindow/initWithoutIcons', initData)
        this.$store.dispatch('ourExtension/windowFlags/openSelectListWindow')
    }

    openSelectWindowWithIcon(callback: Function, initMap: Map<string, string>) {  // Текст иконки, текст элемента
        const initData: SelectListInitData = {
            callbackAfterConfirm: callback,
            initMap: initMap
        }


        this.$store.dispatch('ourExtension/layoutsData/selectListWindow/reset')
        this.$store.dispatch('ourExtension/layoutsData/selectListWindow/initWithIcons', initData)
        this.$store.dispatch('ourExtension/windowFlags/openSelectListWindow')
    }
}