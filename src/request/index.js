const apiList = {
    init: '/init',
    get: '/get'
}
class Request {
    constructor() {

    }
    fetchItem(id) {
        return new Promise((resolve, reject) => {
            if (apiList[id]) {
                let timer = setTimeout(() => {
                    resolve(apiList[id])
                    clearTimeout(timer)
                }, 1000);
            } else {
                reject(`id not found in apiList`)
            }
        })
    }
    getTableData() {
        return new Promise((resolve, reject) => {
            let data = [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }]
            let timer = setTimeout(() => {
                resolve(data)
                clearTimeout(timer)
            }, 1000);
        })
    }
}
export default new Request()