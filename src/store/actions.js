import types from './mutation-types'
import { fetchItem } from '../request'
export default {
    fetchItem({ commit }, id) {
        // `store.dispatch()` 会返回 Promise，
        // 以便我们能够知道数据在何时更新
        return fetchItem(id).then(item => {
            console.log('then', item)
            commit(types.SETITEM, {
                id,
                item
            })
        }).catch(item => {
            console.log('catch', item)
            commit(types.SETITEM, {
                id,
                item
            })
        })
    }
}