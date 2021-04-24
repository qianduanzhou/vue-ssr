import Vue from 'vue'
import {
    createApp
} from './app'
import ProgressBar from './components/ProgressBar.vue'

//生成一个vue实例并添加到body里 $mount()执行后才有$el存在
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

const {
    app,
    router,
    store
} = createApp()
//将服务端的state替换客户端的state，保证数据一致性
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}

/**
 * 处理页面跳转有两种方式
 * 1.等待页面数据全部加载完成再跳转，配合一个指示器(loading)效果更好，不然会感到明显卡顿
 * 2.先跳转页面，但是此时数据显示不全，可以配合beforeMount在数据全部加载后再执行其他任务
 */
Vue.mixin({
    //这是第二种方式
    // beforeMount () {
    //     const { asyncData } = this.$options
    //     if (asyncData) {
    //       // 将获取数据操作分配给 promise
    //       // 以便在组件中，我们可以在数据准备就绪后
    //       // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
    //       this.dataPromise = asyncData({
    //         store: this.$store,
    //         route: this.$route
    //       })
    //     }
    // },
    beforeRouteUpdate(to, from, next) {
        const {
            asyncData
        } = this.$options
        bar.start()
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to
            }).then(res => {
                next(res)
                bar.finish()
            }).catch(err => {
                next(err)
                bar.finish()
            })
        } else {
            next()
            bar.finish()
        }
    }
})

//这是第一种方式
// 添加路由钩子函数，用于处理 asyncData.
// 在初始路由 resolve 后执行，
// 以便我们不会二次预取(double-fetch)已有的数据。
// 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
router.onReady(() => {
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to)

        // 这里如果有加载指示器 (loading indicator)，就触发
        bar.start()

        //等待所有匹配到的路由中的asyncData加载完成后跳转
        Promise.all(matched.map(c => {
            if (c.asyncData) {
                return c.asyncData({
                    store,
                    route: to
                })
            }
        })).then(() => {
            // 停止加载指示器(loading indicator)
            bar.finish()

            next()
        }).catch(next)
    })
    app.$mount('#app')
})