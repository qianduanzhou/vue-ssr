import types from './mutation-types'
import Vue from 'vue'
export default {
    [types.SETITEM](state, { id, item }) {
        Vue.set(state.items, id, item)
    },
    [types.SETTABLEDATA](state, {data}) {
        state.tableData = data
    }
}