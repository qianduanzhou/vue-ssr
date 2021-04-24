import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
//() => import(/* webpackChunkName: "index" */'view/index.vue')
export function createRouter() {
	return new Router({
		mode: 'history',
		routes: [
			{
				"path": "/",
				"component": () => import(/* webpackChunkName: "index" */'view/index.vue')
			},
			{
				"path": "/item/:id",
				"component": () => import(/* webpackChunkName: "item-_id-index" */'view/item/_id/index.vue')
			}
		]
	})
}