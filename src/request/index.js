const apiList = {
    init: '/init'
}
export function fetchItem(id) {
    return new Promise((resolve, reject) => {
        console.log('apiList', apiList[id])
        if(apiList[id]) {
            resolve(apiList[id])
        } else {
            reject(`id not found in apiList`)
        } 
    })
}