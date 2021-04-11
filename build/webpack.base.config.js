/**
 * webpack4文档：https://webpack.html.cn/
 */
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');//文件复制
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;//打包块分析
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
// CSS 提取应该只用于生产环境
// 这样我们在开发过程中仍然可以热重载
const isProduction = process.env.NODE_ENV === 'production'
const isAnalyzer = process.env.ANALYZER === 'true'
//文件内容替换
function replaceUrl(text) {
	let result = ''
	result = text.replace(/\.\.\/src\/index\.template\.html/g, '../index.template.html')
	result = result.replace(/\.\.\/dist/g, '..')
	return result
}
let config = {
	//启用webpack内置的优化,有'production'和'development'两个选项，将会添加不同的plugin，具体看webpack4官方文档
	mode: isProduction ? 'production' : 'development',
	//选择一种source map格式来增强调试过程。一般生产环境下不使用
	devtool: isProduction ? false : 'cheap-module-source-map',
	//打包后输出相关的配置，只能有一个
	output: {
		path: resolve('../dist'),//生成的目录，对应一个绝对路径。
		publicPath: '/dist/',//应用程序中所有资源的基础路径。
		filename: '[name].[hash].js'//生成文件的名字
	},
	//配置模块如何解析
	resolve: {
		//创建别名
		alias: {
		  'public': resolve('../public'),
		  'components': resolve('../src/components'),
		  'view': resolve('../src/view'),
		  'request': resolve('../src/request'),
		  'utils': resolve('../src/utils/')
		}
	},
	//模块，处理项目中不同的模块类型
	module: {
		//创建模块时，匹配请求的规则数组
		rules: [
			{
				test: /\.js$/,//匹配的文件
				exclude: /node_modules/,//排除的目录
				loader: "babel-loader"//使用的loader
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					// hotReload: false // 关闭热重载
				}
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/,
				use: {
                    loader: 'url-loader',
                    options: {//url-loader相关配置
						outputPath: 'assets/img',//输出图片的地址，相对于output.path
    					publicPath: '../dist/assets/img',//图片的服务地址
                        limit: 3000,//文件大小低于limit时将图片打包在js中，生成base64
						esModule: false, // 这里设置为false，显示图片地址
						name: '[name].[ext]?[hash]',//生成图片的名字
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
		new VueLoaderPlugin()//使用vue-loader必须添加到plugins里
	]
}
if(isProduction) {
	config.plugins.push(new CopyWebpackPlugin(
		{
			patterns: [
				{from: resolve('../public'),to: resolve('../dist/public')},
				{
					from: resolve('../server'),
					to: resolve('../dist/server'),
					transform(content) {
						// 修改文件的内容
						return replaceUrl(content.toString());
					},
				},
				{from: resolve('../src/index.template.html'),to: resolve('../dist')}
			]
		}
	))
}
if(isAnalyzer) {
	//分析打包的代码块
	config.plugins.push(new BundleAnalyzerPlugin())
}
module.exports = config