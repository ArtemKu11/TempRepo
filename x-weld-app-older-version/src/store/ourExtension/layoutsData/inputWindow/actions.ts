import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { defaultFlags } from "./state";
import { FlagsObject, InitInputWindowData, InputWindowState } from "./types";
import { TimeProcessor } from "@/components/inputWindow/timeProcessor";

export const actions: ActionTree<InputWindowState, RootState> = {
    initInputWindow({ commit }, payload: InitInputWindowData) {  // Можно писать свои имплементации этой функции в связке с dispatch('confirm')
        commit('reset')  // Обязательно
        commit('setInputWindowData', payload.inputWindowData)  // Данные отсюда используются для отрисовки в шаблоне и в dispatch('confirm'). Можно заменять на свой объект, определив в types.ts
        commit('setProcessingValue', payload.inputWindowData.initValue + "")  // Обязательно. Используется непосредственно для отображения и изменения значения в шаблоне
        commit('setFinalValue', payload.inputWindowData.initValue)  // Используется только в confirm
        commit('setValcoderStep', payload.valcoderStep)  // Обязательно. Используется в шаблоне валкодера в расчетах
        const flags = JSON.parse(JSON.stringify(defaultFlags))
        commit('setFlags', flags)  // Обязательно. Для отрисовки нужно вариации окна в шаблоне
        if (payload.inputWindowData.rejectPointClick) {
            commit('rejectPointClick')  // Если нужно отменить клик по точке (нужны только целые значения)
        }
    },

    initNotDefaultInputWindow({ commit }, payload: InitInputWindowData) {
        commit('reset')
        commit('setInputWindowData', payload.inputWindowData)
        commit('setProcessingValue', payload.inputWindowData.initValue + "")
        commit('setFinalValue', payload.inputWindowData.initValue)
        commit('setValcoderStep', payload.valcoderStep)
        const flags: FlagsObject = JSON.parse(JSON.stringify(defaultFlags))
        flags.defaultImplementation = false
        flags.notDefaultImplementation = true;
        commit('setFlags', flags)
        if (payload.inputWindowData.rejectPointClick) {
            commit('rejectPointClick')
        }
    },

    confirm({ dispatch, commit, state }) {  // Можно писать свои имплементации этой функции в связке с dispatch('initInputWindow')
        dispatch('ourExtension/windowFlags/openPreviousWindow', null, { root: true });
        if (state.inputWindowData?.isItTime) {
            state.finalValue = TimeProcessor.toSeconds(state.processingValue)
        } else {
            state.finalValue = +state.processingValue;
        }

        const confirmCallback = state.inputWindowData?.callbackAfterConfirm;
        if (confirmCallback) {
            confirmCallback(state.finalValue)
        }

        const confirmDispatch = state.inputWindowData?.dispachAfterConfirm;
        if (confirmDispatch === 'void' || !confirmDispatch) {
            return;
        }
        dispatch(confirmDispatch, state.finalValue, { root: true });
    }
}