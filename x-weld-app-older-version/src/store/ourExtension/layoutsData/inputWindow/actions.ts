import { RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { defaultFlags } from "./state";
import { InitInputWindowData, InputWindowState } from "./types";

export const actions: ActionTree<InputWindowState, RootState> = {
    initInputWindow({ commit }, payload: InitInputWindowData) {  // Можно писать свои имплементации этой функции в связке с dispatch('confirm')
        commit('reset')  // Обязательно
        commit('setInputWindowData', payload.inputWindowData)  // Данные отсюда используются для отрисовки в шаблоне и в dispatch('confirm'). Можно заменять на свой объект, определив в types.ts
        commit('setProcessingValue', payload.inputWindowData.initValue + "")  // Обязательно. Используется непосредственно для отображения и изменения значения в шаблоне
        commit('setFinalValue', payload.inputWindowData.initValue)  // Используется только в confirm
        commit('setValcoderStep', payload.valcoderStep)  // Обязательно. Используется в шаблоне валкодера в расчетах
        const flags = JSON.parse(JSON.stringify(defaultFlags))
        commit('setFlags', flags)  // Обязательно. Для отрисовки нужно вариации окна в шаблоне
    },

    confirm({ dispatch, commit, state }) {  // Можно писать свои имплементации этой функции в связке с dispatch('initInputWindow')
        dispatch('ourExtension/windowFlags/openPreviousWindow', null, { root: true });
        const confirmDispatch = state.inputWindowData?.dispachAfterConfirm;
        if (confirmDispatch === 'void' || !confirmDispatch) {
            state.finalValue = +state.processingValue;
            return;
        }
        state.finalValue = +state.processingValue;
        dispatch(confirmDispatch, state.finalValue, { root: true });
    }
}