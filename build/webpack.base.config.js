const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')

// CSS 提取应该只用于生产环境
// 这样我们在开发过程中仍然可以热重载
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
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
        test: /\.css$/,
        // 重要：使用 vue-style-loader 替代 style-loader
        use: [isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          'postcss-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    isProduction
    // 确保添加了此插件！
    ? new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }) : ''
  ]
}