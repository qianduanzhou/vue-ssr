const fs = require('fs')
const path = require('path')
const MFS = require('memory-fs')//操作内存的文件系统
const webpack = require('webpack')
const chokidar = require('chokidar')//封装 Node.js 监控文件系统文件变化功能的库
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')
const mfs = new MFS()
const writeRouter = require('../fs/index')
const renderRouter = process.env.RENDER_ROUTER === 'true'//是否执行动态路由表
const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
  } catch (e) {}
}
let isFirstRender = true //判断是否是第一次渲染，由于chokidar监听add事件第一次会监听所有文件的新增，所有需要排除掉第一次
module.exports = function setupDevServer (app, templatePath, cb) {
  let bundle
  let template
  let clientManifest

  let ready
  const readyPromise = new Promise(r => { ready = r })
  const update = () => {
    if (bundle && clientManifest) {//文件更新后且两个文件存在时resolve，并执行回调
      ready()
      isFirstRender = false
      cb(bundle, {
        template,
        clientManifest
      })
    }
  }

  // read template from disk and watch
  template = fs.readFileSync(templatePath, 'utf-8')
  chokidar.watch(templatePath).on('change', () => {//监听模板变化
    template = fs.readFileSync(templatePath, 'utf-8')
    console.log('index.html template updated.')
    update()
  })
  chokidar.watch(path.resolve(__dirname,'../src/view')).on('add', () => {//监听view文件下的新增
    if(!isFirstRender) {
      renderRouter && writeRouter()//路由写入方法
      update()
    }
  })
  chokidar.watch(path.resolve(__dirname,'../src/view')).on('unlink', () => {//监听view文件下的删除
    if(!isFirstRender) {
      renderRouter && writeRouter()//路由写入方法
      update()
    }
  })
  /**
   * https://github.com/webpack-contrib/webpack-hot-middleware
   * 添加热重载及相关参数 noInfo：不输出相关信息 reload：自动更新
   */
  clientConfig.entry.app = ['webpack-hot-middleware/client?noInfo=true&reload=true', clientConfig.entry.app]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    // new webpack.optimize.OccurrenceOrderPlugin(),//webpack 1.x
    new webpack.HotModuleReplacementPlugin(),//启用热重载
    // new webpack.NoEmitOnErrorsPlugin()//webpack 1.x
  )

  // dev middleware
  const clientCompiler = webpack(clientConfig)
  /**
   * 使用该插件修改文件时无需重新编译，一般配合webpack-hot-middleware实现热重载
   * https://www.npmjs.com/package/webpack-dev-middleware
   */
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,//绑定中间件的公共路径,与webpack配置的路径相同
    // quiet: true,//向控制台显示任何内容 
    noInfo: true//显示无信息到控制台（仅警告和错误） 
  })

  //使用webpack-dev-middleware中间件
  app.use(devMiddleware)
  clientCompiler.plugin('done', stats => {//在成功构建并且输出了文件后，Webpack 即将退出时发生；
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return
    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      'vue-ssr-client-manifest.json'
    ))
    update()
  })
  
  //使用热重载中间件
  app.use(require('webpack-hot-middleware')(clientCompiler))

  const serverCompiler = webpack(serverConfig)
  serverCompiler.outputFileSystem = mfs //将serverCompiler的文件系统改成内存系统
  serverCompiler.watch({}, (err, stats) => {//当文件发生改变时执行
    if (err) throw err
    stats = stats.toJson()
    if (stats.errors.length) return
    // read bundle generated by vue-ssr-webpack-plugin
    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
    update()
  })

  return readyPromise
}
