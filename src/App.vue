<template>
	<div id="app">
		<div class="block">
			<p>vue路由跳转</p>
			<el-button type="primary" @click="$router.push('/')">Index</el-button>
			<el-button type="warning" @click="$router.push('/item/init')">Item-init</el-button>
			<el-button type="danger" @click="$router.push('/item/get')">Item-get</el-button>
		</div>
		<div class="block">
			<p>a标签跳转</p>
			<a href="/">Index</a>
			<a href="/item/init">Item-init</a>
			<a href="/item/get">Item-get</a>
			<a href="/no">404</a>
		</div>

		<div class="main">
			<p>router-view内容：</p>
			<router-view></router-view>
		</div>
		
	</div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {}
};
</script>

<style scoped lang="less">
	#app {
		.block {
			
		}
		.main {
			border: 1px solid #ccc;
			margin-top: 50px;
			padding: 0 50px;
		}
	}
</style>
