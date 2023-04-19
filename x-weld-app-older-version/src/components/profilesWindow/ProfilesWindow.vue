<template>
    <div @click="closeLayersSetup" class="content-container profiles-window" :class="{ 'full-screen': !layersBarFlag }">

        <LayersBar ref="layersBar" @openLayersSetup="openLayersSetup" v-if="layersBarFlag" />
        <LayersSetup ref="layersSetup" @forceUpdate="forceUpdateSelectedDiapason" v-if="layersSetupFlag" />
        <div id="content-header">
            <div id="name-container">{{ headerText }} {{ layersText }}</div>
            <div id="coordinates-container">
                <img src="@/layouts/profiles_layout/img/gorelka_logo.svg" />
                <span id="x-coords">{{ coordinatesHolder[0] }}</span>
                <span id="y-coords">{{ coordinatesHolder[1] }}</span>
                <span id="z-coords">{{ coordinatesHolder[2] }}</span>
            </div>
        </div>
        <div id="content-center">


            <div id="parameters-holder">
                <div class="first-holder">
                    <img src="@/layouts/profiles_layout/img/parameter_icon.svg">
                    <span>Режим наплавки</span>
                    <button >Пользовательский</button>
                    <span @click="openProfileSelect">{{ selectedDiapason.profile.name }} {{ appendPostfix }}</span>
                    <!-- <button><span>{{ selectedDiapason.profile.name }}</span></button> -->
                </div>

                <div class="usual-holder">
                    <img src="@/layouts/profiles_layout/img/parameter_icon.svg">
                    <span>Основные параметры:</span>
                    <div class="tree-buttons-holder">
                        <button @click="digitParameterClick('profile.profileMainParameters.current')"
                            class="parameter-button">
                            <span>{{ selectedDiapason.profile.profileMainParameters.current }}</span>
                            <div class="underline"></div>
                            <span>Ток, А</span>
                        </button>
                        <button @click="digitParameterClick('profile.profileMainParameters.voltage')"
                            class="parameter-button">
                            <span>{{ selectedDiapason.profile.profileMainParameters.voltage }}</span>
                            <div class="underline"></div>
                            <span>Напряжение, В</span>
                        </button>
                        <button @click="digitParameterClick('profile.profileMainParameters.feedRate')"
                            class="parameter-button">
                            <span>{{ selectedDiapason.profile.profileMainParameters.feedRate }}</span>
                            <div class="underline"></div>
                            <span>V подачи, м/мин</span>
                        </button>
                    </div>
                </div>

                <div class="usual-holder">
                    <img src="@/layouts/profiles_layout/img/parameter_icon.svg">
                    <span>Дополнительные параметры:</span>
                    <div class="tree-buttons-holder">
                        <button @click="digitParameterClick('profile.profileAdditionalParameters.arcLength')"
                            class="parameter-button">
                            <span>{{ selectedDiapason.profile.profileAdditionalParameters.arcLength }}</span>
                            <span>Длина дуги</span>
                        </button>
                        <button @click="digitParameterClick('profile.profileAdditionalParameters.dynamic')"
                            class="parameter-button">
                            <span>{{ selectedDiapason.profile.profileAdditionalParameters.dynamic }}</span>
                            <span>Динамика</span>
                        </button>
                        <button @click="digitParameterClick('profile.profileAdditionalParameters.weldingSpeed')"
                            class="parameter-button">
                            <span>{{ selectedDiapason.profile.profileAdditionalParameters.weldingSpeed }}</span>
                            <span>V наплавки, м/мин</span>
                        </button>
                    </div>
                </div>

                <div class="usual-holder">
                    <img src="@/layouts/profiles_layout/img/parameter_icon.svg">
                    <span>Параметры осцилляции:</span>
                    <div class="tree-buttons-holder">
                        <button @click="listButtonClick('oscillationType')" class="parameter-button">
                            <img src="@/layouts/profiles_layout/img/oscilation.svg" alt="">
                            <span>Тип: {{ selectedDiapason.profile.profileOscilationParameters.type }}</span>
                        </button>
                        <button @click="digitParameterClick('profile.profileOscilationParameters.width')"
                            class="parameter-button">
                            <span>{{ selectedDiapason.profile.profileOscilationParameters.width }}</span>
                            <span>Ширина, мм</span>
                        </button>
                        <button @click="digitParameterClick('profile.profileOscilationParameters.period')"
                            class="parameter-button">
                            <span>{{ selectedDiapason.profile.profileOscilationParameters.period }}</span>
                            <span>Период, мм</span>
                        </button>
                    </div>
                </div>

            </div>

            <div id="setup-buttons-holder">
                <div class="for-buttons">
                    <div class="setup-button-wrapper">
                        <button @click="listButtonClick('gas')" class="setup-button">{{
                            selectedDiapason.profile.profileWeldParameters.gas }}</button>
                        <span>Защитный газ</span>
                    </div>
                    <div class="setup-button-wrapper">
                        <button @click="listButtonClick('wireDiameter')" class="setup-button">{{
                            selectedDiapason.profile.profileWeldParameters.wireDiameter }}
                            mm</button>
                        <span>Диаметр проволоки</span>

                    </div>
                    <div class="setup-button-wrapper">
                        <button @click="listButtonClick('material')" class="setup-button">{{
                            selectedDiapason.profile.profileWeldParameters.material }}</button>
                        <span>Материал</span>

                    </div>
                    <div class="setup-button-wrapper">
                        <button @click="listButtonClick('method')" class="setup-button">{{
                            selectedDiapason.profile.profileWeldParameters.method }}</button>
                        <span>Способ</span>
                    </div>
                </div>


                <div id="reset-save-buttons-holder">
                    <button @click="refreshToDefault" class="reset-save-button"><img
                            src="@/layouts/profiles_layout/img/reset.svg"><span>По
                            умолчанию</span></button>
                    <button @click="confirm" class="reset-save-button"><img
                            src="@/layouts/profiles_layout/img/save.svg"><span>{{ confirmButtonText }}</span></button>
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { FileData, GcodePrintingProfiles } from '@/store/ourExtension/files/types';
import { InitInputWindowData, InputWindowData } from '@/store/ourExtension/layoutsData/inputWindow/types';
import { printingDiapasonProcessor, resolveParamNameByPath } from '@/store/ourExtension/profiles/helpers';
import { PrintingDiapason, Profile, ProfileAdditionalParameters, ProfileMainParameters, ProfileOscilationParameters, ProfilesMetadata } from '@/store/ourExtension/profiles/types';
import { Component, Vue } from 'vue-property-decorator';
import { SelectListInitData } from '@/store/ourExtension/layoutsData/selectListWindow/types'
import LayersBar from './LayersBar.vue'
import LayersSetup from './LayersSetup.vue'

@Component({
    components: {
        LayersBar, LayersSetup
    },
})
export default class ProfilesWindow extends Vue {
    selectedDiapason: PrintingDiapason = this.getSelectedDiapason();
    allowPointWhenChangeWalue = ['profile.profileOscilationParameters.period', 'profile.profileOscilationParameters.width',
        'profile.profileAdditionalParameters.weldingSpeed', 'profile.profileMainParameters.feedRate']
    processingParameterPath = ''

    // get selectedDiapason(): PrintingDiapason {
    //     return this.$store.state.ourExtension.layoutsData.profilesWindow.selectedDiapason
    // }

    get coordinatesHolder(): number[] {
        return this.$store.getters['ourExtension/layoutsData/moveWindow/getCoordinates']
    }

    get file(): FileData {
        return this.$store.getters['ourExtension/layoutsData/profilesWindow/getFile']
    }

    get layersBarFlag(): boolean {
        if (this.isItInitWithGlobalProfiles) {
            return false;
        } else {
            return this.file.layers !== '?' && this.file.layers !== '' && !isNaN(parseInt(this.file.layers))
        }

    }

    getSelectedDiapason(): PrintingDiapason {
        return this.$store.state.ourExtension.layoutsData.profilesWindow.selectedDiapason
    }

    get headerText(): string {
        return this.$store.getters['ourExtension/layoutsData/profilesWindow/getHeaderText']
    }

    get layersText(): string {
        return this.$store.getters['ourExtension/layoutsData/profilesWindow/getLayersText']
    }

    get layersSetupFlag(): boolean {
        return this.$store.getters['ourExtension/layoutsData/profilesWindow/getLayersSetupWindowFlag']
    }

    get isItLastPrintingProfile(): boolean {
        return this.$store.getters['ourExtension/layoutsData/profilesWindow/isItLastPrintingProfile']
    }

    get appendPostfix() {
        if (this.isItLastPrintingProfile) return "(Посл. печать)"
        return ''
    }

    get isItInitWithGlobalProfiles() {
        return this.$store.getters['ourExtension/layoutsData/profilesWindow/isItInitWithGlobalProfiles']()
    }

    get confirmButtonText() {
        if (this.isItInitWithGlobalProfiles) {
            return 'Сохранить'
        } else {
            return 'Применить'
        }
    }

    mounted() {
        // console.log(this.file)
    }

    beforeDestroy() {
        this.$store.commit('ourExtension/layoutsData/profilesWindow/closeLayersSetupWindow')
    }

    confirm() {
        this.$store.dispatch('ourExtension/layoutsData/profilesWindow/confirm')
    }

    openLayersSetup() {
        if (this.layersSetupFlag) {
            this.$store.commit('ourExtension/layoutsData/profilesWindow/closeLayersSetupWindow')
        } else {
            this.$store.commit('ourExtension/layoutsData/profilesWindow/openLayersSetupWindow')
        }
    }

    closeLayersSetup(e: MouseEvent) {
        const layersSetup = this.$refs.layersSetup as typeof this
        const layersBar = this.$refs.layersBar as typeof this
        if (!layersSetup || !layersBar) return
        const layersSetupDiv = layersSetup.$refs.layersSetup as HTMLElement
        const layersBarDiv = layersBar.$refs.layersBar as HTMLElement
        if (layersBarDiv && layersSetupDiv) {
            const rect = layersBarDiv.getBoundingClientRect()
            const rect2 = layersSetupDiv.getBoundingClientRect()
            const x1 = rect.x
            const x2 = rect2.x + rect2.width
            const y1 = rect.y
            const y2 = rect.y + rect.height;
            const clickX = e.clientX;
            const clickY = e.clientY;
            if (clickX > x2 || clickX < x1 || clickY > y2 || clickY < y1) {
                this.$store.commit('ourExtension/layoutsData/profilesWindow/closeLayersSetupWindow')
            }

        }
        // const target = e.target as HTMLElement
        // if (!this.isLayoutsHolderInParents(target)) {
        // this.$store.commit('ourExtension/layoutsData/profilesWindow/closeLayersSetupWindow')
        // }
    }

    isLayoutsHolderInParents(element: HTMLElement | null): boolean {
        if (!element) return false;
        if (element.className === 'layouts-holder' || element.id === 'layout-setup') return true
        return this.isLayoutsHolderInParents(element.parentElement)
    }

    forceUpdateSelectedDiapason() {
        this.selectedDiapason = this.getSelectedDiapason()
        this.$forceUpdate()
    }

    digitParameterClick(parameterPath: string) {
        const requiredParameter = this.getRequiredParameterByPath(parameterPath)

        if (!isNaN(parseInt(requiredParameter + '')) && typeof requiredParameter !== 'undefined') {
            const paramName = resolveParamNameByPath(parameterPath)
            let valcoderStep = 1;
            let rejectPoint = true;
            if (this.allowPointWhenChangeWalue.includes(parameterPath)) {
                valcoderStep = 0.1
                rejectPoint = false
            }
            const callback = this.digitParameterNewValueReceiver.bind(this);
            this.processingParameterPath = parameterPath;
            this.openInputWindow(+requiredParameter, callback, paramName, 1000, -1000, valcoderStep, rejectPoint)
        }
    }

    getRequiredParameterByPath(parameterPath: string): number | undefined {
        const selectedDiapason = this.selectedDiapason as any;

        const pathParts = parameterPath.split('.')
        let requiredParameter = selectedDiapason;
        for (const part of pathParts) {
            requiredParameter = requiredParameter[part]
        }
        return requiredParameter;
    }

    getRequiredParameterHolderByPath(parameterPath: string): ProfileMainParameters | ProfileAdditionalParameters | ProfileOscilationParameters {
        const selectedDiapason = this.selectedDiapason as any;

        const pathParts = parameterPath.split('.')
        let requiredHolder = selectedDiapason;
        for (let index = 0; index < pathParts.length - 1; index++) {
            requiredHolder = requiredHolder[pathParts[index]]
        }
        return requiredHolder;
    }

    digitParameterNewValueReceiver(newValue: number) {
        const holder = this.getRequiredParameterHolderByPath(this.processingParameterPath) as any
        const pathParts = this.processingParameterPath.split('.')
        const paramName = pathParts[pathParts.length - 1]
        if (typeof holder[paramName] === 'number') {
            holder[paramName] = newValue
        }
    }

    openInputWindow(initValue: number, confirmCallback: Function, coordName: string, maxValue: number, minValue: number, valcoderStep: number, rejectPointClick: boolean) {
        const inputWindowData: InputWindowData = {
            coordName: coordName,
            initValue: initValue,
            dispachAfterConfirm: `void`,
            callbackAfterConfirm: confirmCallback,
            maxValue: maxValue,
            minValue: minValue,
            rejectPointClick: rejectPointClick
        }
        const initInfo: InitInputWindowData = {
            inputWindowData: inputWindowData,
            valcoderStep: valcoderStep,
        }
        this.$store.dispatch('ourExtension/layoutsData/inputWindow/initNotDefaultInputWindow', initInfo);
        this.$store.dispatch('ourExtension/windowFlags/openInputWindow');
    }

    refreshToDefault() {
        this.$store.dispatch('ourExtension/layoutsData/profilesWindow/refreshToDefault')
    }

    openProfileSelect() {
        const initMap: Map<string, string> = this.$store.getters['ourExtension/layoutsData/profilesWindow/getProfilesNamesMap']()
        initMap.set('Последняя печать', 'Last')
        const callback = this.newProfileValueReceiver.bind(this)

        this.openSelectWindowWithIcon(callback, initMap)
    }

    newProfileValueReceiver(newProfileName: string) {
        this.$store.dispatch('ourExtension/layoutsData/profilesWindow/setProfile', newProfileName)
        this.forceUpdateSelectedDiapason()
    }

    listButtonClick(type: string) {
        const profilesMetadata: ProfilesMetadata = this.$store.getters['ourExtension/profiles/getProfilesMetadata']
        const callback =  this.newListParameterValueReceiver.bind(this);
        let initList = []
        switch (type) {
            case 'gas':
                this.processingParameterPath = 'profile.profileWeldParameters.gas'
                initList = profilesMetadata.gas
                this.openSelectWindowWithoutIcon(callback, initList)
                break;
            case 'wireDiameter':
                this.processingParameterPath = 'profile.profileWeldParameters.wireDiameter'
                initList = profilesMetadata.wireDiameters.map(x => x + '')
                this.openSelectWindowWithoutIcon(callback, initList)
                break;
            case 'material':
                // this.processingParameterPath = 'profile.profileWeldParameters.material'
                // initList = profilesMetadata.
                // this.openSelectWindowWithoutIcon(callback, initList)
                break;
            case 'method':
                this.processingParameterPath = 'profile.profileWeldParameters.method'
                initList = profilesMetadata.weldTypes
                this.openSelectWindowWithoutIcon(callback, initList)
                break;
            case 'oscillationType':
                this.processingParameterPath = 'profile.profileOscilationParameters.type'
                initList = profilesMetadata.oscilationTypes
                this.openSelectWindowWithoutIcon(callback, initList)
                break;

            default:
                break;
        }
    }

    newListParameterValueReceiver(newValue: string) {
        const holder = this.getRequiredParameterHolderByPath(this.processingParameterPath) as any
        const pathParts = this.processingParameterPath.split('.')
        const paramName = pathParts[pathParts.length - 1]
        if (typeof holder[paramName] === 'number') {
            holder[paramName] = +newValue
        } else if (typeof holder[paramName] === 'string') {
            holder[paramName] = newValue
        }
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

    openSelectWindowWithIcon(callback: Function, initMap: Map<string, string>) {
        const initData: SelectListInitData = {
            callbackAfterConfirm: callback,
            initMap: initMap
        }


        this.$store.dispatch('ourExtension/layoutsData/selectListWindow/reset')
        this.$store.dispatch('ourExtension/layoutsData/selectListWindow/initWithIcons', initData)
        this.$store.dispatch('ourExtension/windowFlags/openSelectListWindow')
    }

}
</script>


<style lang="scss">
@import '@/layouts/profiles_layout/css/profiles_layout.scss';

.content-container.profiles-window.full-screen {
    // grid-template-columns: 1;
    padding-left: 25px;

    #content-header {
        grid-column: 1/3;
    }

    #content-center {
        grid-column: 1/3;
    }
}
</style>