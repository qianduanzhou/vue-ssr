import types from './mutation-types'
import request from '../request'
let {fetchItem, getTableData} = request
export default {
    fetchItem({ commit }, id) {
        // `store.dispatch()` 会返回 Promise，
        // 以便我们能够知道数据在何时更新
        return fetchItem(id).then(item => {
            commit(types.SETITEM, {
                id,
                item
            })
        }).catch(item => {
            commit(types.SETITEM, {
                id,
                item
            })
        })
    },
    getTableData({commit}) {
        return getTableData().then(data => {
            commit(types.SETTABLEDATA, {
                data
            })
        })
    },
    clearTableData({commit}) {
        commit(types.SETTABLEDATA, {
            data: null
        })
    }
}