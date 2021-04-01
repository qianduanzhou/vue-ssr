const apiList = {
    init: '/init'
}
export function fetchItem(id) {
    return new Promise((resolve, reject) => {
        resolve(apiList[id])
    })
}