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
// app.$mount('#app')

//这是第一种方式
router.onReady(() => {
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to)
        const prevMatched = router.getMatchedComponents(from)
        // 我们只关心非预渲染的组件
        // 所以我们对比它们，找出两个匹配列表的差异组件
        let diffed = false
        const activated = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c))
        })

        if (!activated.length) {
            return next()
        }

        // 这里如果有加载指示器 (loading indicator)，就触发
        bar.start()

        Promise.all(activated.map(c => {
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
    //第二种方式app在路由准备好后挂载
    app.$mount('#app')
})