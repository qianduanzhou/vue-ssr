const apiList = {
    init: '/init',
    get: '/get'
}
export function fetchItem(id) {
    return new Promise((resolve, reject) => {
        if(apiList[id]) {
            setTimeout(() => {
                resolve(apiList[id])
            }, 3000);
        } else {
            reject(`id not found in apiList`)
        } 
    })
}