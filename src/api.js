const apiList = {
    init: '/init'
}
export default {
    fetchItem(id) {
        return new Promise((resolve, reject) => {
            resolve(apiList[id])
        })
    }
}