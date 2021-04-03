const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
// CSS 提取应该只用于生产环境
// 这样我们在开发过程中仍然可以热重载
const isProduction = process.env.NODE_ENV === 'production'
let config = {
	mode: isProduction ? 'production' : 'development',
	devtool: isProduction ?
		false : '#cheap-module-source-map',
	output: {
		path: resolve('../dist'),
		publicPath: '/dist/',
		filename: '[name].[chunkhash].js'
	},
	resolve: {
		alias: {
		  'public': resolve('../public'),
		  'components': resolve('../src/components'),
		  'view': resolve('../src/view'),
		  'request': resolve('../src/request')
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					// enable CSS extraction
					extractCSS: isProduction
				}
			},
			{
				test: /\.(css|less)$/,
				// 重要：使用 vue-style-loader 替代 style-loader
				use: [isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
					'css-loader',
					'postcss-loader',
					'less-loader'
				]
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/,
				use: {
                    loader: 'url-loader',
                    options: {
						outputPath:"assets/img",
    					publicPath:'./img',
                        limit: 0,
						esModule: false, // 这里设置为false
						name: 'img.[name].[ext]?[hash]'
                    }
                }
			},
			{
				test: /\.(woff|svg|eot|ttf)$/,
				use: {
                    loader: 'url-loader',
                    options: {
						outputPath:"assets/iconfont",
						name: 'iconfont.[name].[ext]?[hash]'
                    }
                }
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
}
if (isProduction) {
	// 确保添加了此插件！
	config.plugins.push(new MiniCssExtractPlugin({
		filename: 'common.[chunkhash].css'
	}))
}
module.exports = config