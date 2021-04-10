import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter() {
	return new Router({
		mode: 'history',
		routes: [
		{
				"path": "/home/item",
				"component": () => import('view/home/item.vue')
		},
		{
				"path": "/home/test/test",
				"component": () => import('view/home/test/test/index.vue')
		},
		{
				"path": "/home/:id",
				"component": () => import('view/home/_id/index.vue')
		},
		{
				"path": "/home/:id/test",
				"component": () => import('view/home/_id/test.vue')
		},
		{
				"path": "/",
				"component": () => import('view/index.vue')
		},
		{
				"path": "/item/:id",
				"component": () => import('view/item/_id/index.vue')
		},
		{
				"path": "/Item",
				"component": () => import('view/Item.vue')
		}
]
	})
}