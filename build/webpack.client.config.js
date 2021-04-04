const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
	merge
} = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const isProduction = process.env.NODE_ENV === 'production'
let config = merge(baseConfig, {
	entry: {
		app: '/src/entry-client.js'
	},
	optimization: {
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			maxSize: 0,
			minChunks: 1,
			maxAsyncRequests: 6,
			maxInitialRequests: 4,
			automaticNameDelimiter: '~',
			cacheGroups: {
				vendors: {
					name: `chunk-vendors`,
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					chunks: 'initial'
				},
				common: {
					name: `chunk-common`,
					minChunks: 2,
					priority: -20,
					chunks: 'initial',
					reuseExistingChunk: true
				}
			}
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
			]
		}]
	},
	plugins: [
		// 此插件在输出目录中
		// 生成 `vue-ssr-client-manifest.json`。
		new VueSSRClientPlugin()
	]
})
if (isProduction) {
	// 确保添加了此插件！
	config.plugins.push(new MiniCssExtractPlugin({
		filename: 'common.[chunkhash].css'
	}))
}
module.exports = config