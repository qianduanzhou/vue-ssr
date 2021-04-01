const Vue = require('vue')
const server = require('express')()
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')

const template = require('fs').readFileSync(resolve('./index.template.html'), 'utf-8')
const serverBundle = require(resolve('../dist/vue-ssr-server-bundle.json'))
const clientManifest = require(resolve('../dist/vue-ssr-client-manifest.json'))

const renderer = createBundleRenderer(serverBundle, {
  template,
  clientManifest,
  basedir: resolve('./dist')
})
server.get('*', (req, res) => {
  const context = {
    title: 'demo'
  }
  renderer.renderToString(context, (err, html) => {
    console.log('err, html', 12123)
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})
server.listen(8080, () => {
  console.log(`server started at localhost: 8080`)
})