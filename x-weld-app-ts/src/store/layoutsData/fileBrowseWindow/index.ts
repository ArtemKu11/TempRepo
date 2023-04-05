import getters from "./getters";
import mutations from "./mutations";
import { state } from "./state";

const namespaced = true;

export default {
    namespaced,
    state,
    getters,
    mutations
}