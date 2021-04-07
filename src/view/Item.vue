<!-- Item.vue -->
<template>
	<div class="Item">
		{{id}}
		<template>
			<el-table
			 :data="tableData"
			 style="width: 100%"
			>
				<el-table-column
				 prop="date"
				 label="日期"
				 width="180"
				>
				</el-table-column>
				<el-table-column
				 prop="name"
				 label="姓名"
				 width="180"
				>
				</el-table-column>
				<el-table-column
				 prop="address"
				 label="地址"
				>
				</el-table-column>
			</el-table>
		</template>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
	asyncData({ store, route }) {
		// 触发 action 后，会返回 Promise
		return Promise.all([
			store.dispatch("fetchItem", route.params.id),
			store.dispatch("getTableData")
		]);
	},
  	data() {
    	return {};
  	},
	computed: {
		id() {
			return this.$store.state.items[this.$route.params.id];
		},
		...mapGetters({
			tableData: "getTableData"
		})
	},
	beforeMount() {
		// 第二种方式
		// this.dataPromise.then(() => {
		//   	console.log('dataPromise-done')
		// 	this.tableData && this.$message.success('加载完成')
		// })
	},
	mounted() {
		//第一中方式
		this.$message.success('加载完成')
	},
	beforeDestroy() {
		this.clearTableData()
	},
	methods: {
		...mapActions([
			'clearTableData'
		])
	}
	
};
</script>

<style lang="less" scoped>
</style>
