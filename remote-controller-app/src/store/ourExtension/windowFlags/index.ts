/*
Добавление экранов, чтобы работала кнопка "Назад":
1. types.ts -> добавить в FlagsObject -> windowNameFlag: boolean
2. state.ts -> добавить init flag в initWindowFlags
3. Реализовать геттер флага (getWindowNameFlag)
4. Реализовать mutation флага (какие флаги true, какие false для включения экрана)
5. Реализовать action флага аналогично другим (После открытия экрана добавлять его в стек или чистить стек)
6. Вызывать action в листенере события
7. В template показывать по v-if="computedWindowNameFlag"
8. В get computedWindowNameFlag(): boolean { return this.$store.getters["windowFlag/getWindowNameFlag"] }
*/


import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { state } from "./state";

const namespaced = true;

export default {
    namespaced,
    actions,
    mutations,
    state,
    getters
}