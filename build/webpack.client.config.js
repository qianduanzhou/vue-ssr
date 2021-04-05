const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
	merge
} = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const isProduction = process.env.NODE_ENV === 'production'
let config = merge(baseConfig, {
	entry: {
		app: '/src/entry-client.js',
		// entry1: '/src/entry/entry1.js',
		// entry2: '/src/entry/entry2.js',
		// entry3: '/src/entry/entry3.js'
	},
	optimization: {
		/**
		 * 对模块进行拆分，webpack4版本以前使用CommonsChunkPlugin 
		 * 参考：https://webpack.docschina.org/plugins/split-chunks-plugin/
		 * 		 https://juejin.cn/post/6844903680307625997
		 */
		splitChunks: {
			/**
			 * 默认打包情况：
			 * 新代码块可以被共享引用，或者这些模块都是来自node_modules文件夹里面
			 * 新代码块大于30kb（min+gziped之前的体积）
			 * 按需加载的代码块，并行请求最大数量应该小于或者等于6
			 * 初始加载的代码块，并行请求最大数量应该小于或等于4
			 */
			/**
			 * chunks 表示哪些代码需要优化，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为async
			 * 1.async 动态加载的模块会被单独打包，如vue路由动态加载
			 * 2.all 使用同步或动态加载的同个文件都打包到一起
			 * 3.initial 使用同步或动态加载的同个文件分别打包
			 */
			chunks: 'initial',
			minSize: 30000,//表示在压缩前的最小模块大小，默认为30000(30kb)，拆分的包都大于这个数
			maxSize: 0,//最大字节数，超过则继续分包
			minChunks: 1,//表示被引用次数，默认为1 超过引用的次数才会继续分包
			maxAsyncRequests: 5,//动态加载时候最大的并行请求数(如果一个页面引入超过这个数的import()，则最多打包成这个数的包)，默认为5
			maxInitialRequests: 3,//一个入口最大的并行请求数(如果一个页面引入超过这个数的import，则最多打包成这个数的包)，默认为5，默认为3
			automaticNameDelimiter: '~',//命名连接符\
			name: '',//拆分出来块的名字，默认由块名和hash值自动生成
			/**
			 * 缓存组。缓存组的属性除上面所有属性外，还有test, priority, reuseExistingChunk
			 * test 用于控制哪些模块被这个缓存组匹配到
			 * priority 优先级，数字越大，优先级越高
			 * reuseExistingChunk 如果当前代码块包含的模块已经有了，就不在产生一个新的代码块
			 */
			 cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					chunks: "all",
					priority: 10,
					enforce: true
				},
				commons: {
					chunks: "all",
					minChunks: 2,
					maxInitialRequests: 5,
					// minSize: 0,
					priority: 0
				}
			},
		},
		//抽离webpack运行时的文件
		runtimeChunk: {
			name: "manifest"
		}
	},
	module: {
		rules: [{
			test: /\.(css|less)$/,
			// 重要：使用 vue-style-loader 替代 style-loader
			use: [isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
				'css-loader',
				'postcss-loader',
				'less-loader'
			]//数组后面的loader先加载
		}]
	},
	plugins: [
		/**
		 * 此插件在输出目录中
		 * 生成 `vue-ssr-client-manifest.json`。
		 */
		new VueSSRClientPlugin(),
		//定义不同的环境变量
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
			'process.env.VUE_ENV': "'client'"
		})
	]
})
if (isProduction) {
	/**
	 * 确保添加了此插件！使用该插件，忽略vue-loader对css的相关配置
	 * 抽离css样式文件
	 **/
	config.plugins.push(new MiniCssExtractPlugin({
		filename: 'common.[chunkhash].css'//css文件名字
	}))
}
module.exports = config