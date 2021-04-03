const Vue = require('vue')
const express = require('express')
const app = express()
const favicon = require('serve-favicon')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')

const resolve = file => path.resolve(__dirname, file)
const templatePath = resolve('../src/index.template.html')
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`
const isProd = process.env.NODE_ENV === 'production'

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

let readyPromise,renderer
if(isProd) {
  const template = require('fs').readFileSync(templatePath, 'utf-8')
  const serverBundle = require(resolve('../dist/vue-ssr-server-bundle.json'))
  const clientManifest = require(resolve('../dist/vue-ssr-client-manifest.json'))
  renderer = createRenderer(serverBundle, {
    template,
    clientManifest
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

app.use('/dist', serve('../dist', true))
app.use(favicon(resolve('../public/img/logo-48.png')))

app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
}
)
app.listen(8080, () => {
  console.log(`server started at localhost: 8080`)
})

