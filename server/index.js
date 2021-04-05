const express = require('express')
const app = express()
const favicon = require('serve-favicon')//网页图标
const path = require('path')
/**
 * 服务端渲染的关键
 * https://ssr.vuejs.org/zh/api/
 */
const { createBundleRenderer } = require('vue-server-renderer')

const resolve = file => path.resolve(__dirname, file)
const templatePath = resolve('../src/index.template.html')
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`
const isProd = process.env.NODE_ENV === 'production'

//静态目录配置
const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

let readyPromise,renderer
if(isProd) {
  const template = require('fs').readFileSync(templatePath, 'utf-8')
  const serverBundle = require(resolve('../dist/vue-ssr-server-bundle.json'))
  const clientManifest = require(resolve('../dist/vue-ssr-client-manifest.json'))
  /**
   * 第一个参数可以是以下之一：
   * 绝对路径，指向一个已经构建好的 bundle 文件（.js 或 .json）。必须以 / 开头才会被识别为文件路径。
   * webpack + vue-server-renderer/server-plugin 生成的 bundle 对象。
   * JavaScript 代码字符串（不推荐）。
   */
  renderer = createRenderer(serverBundle, {
    template,//模板
    clientManifest//由 vue-server-renderer/client-plugin 生成的客户端构建 manifest 对象
  })
} else {
  readyPromise = require(resolve('../build/setup-dev-server'))(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )
}
function createRenderer (bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, options)
}
function render (req, res) {
  const s = Date.now()

  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)

  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if(err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).send('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }

  const context = {
    title: 'Vue ssr', // default title
    url: req.url
  }
  /**
   * renderToString将context传递给entry-server，
   * vue实例挂载的内容变成html，返回给客户端
   */
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.send(html)
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  })
}

app.use('/dist', serve('../dist', true)) //访问/dist时访问dist目录下的文件
app.use(favicon(resolve('../public/img/logo-48.png')))

app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
}
)
app.listen(8080, () => {
  console.log(`server started at localhost: 8080`)
})

