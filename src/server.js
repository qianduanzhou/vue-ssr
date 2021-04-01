const Vue = require('vue')
const server = require('express')()
const path = require('path')

const { createBundleRenderer } = require('vue-server-renderer')

const template = require('fs').readFileSync(path.join(__dirname + '/index.template.html'), 'utf-8')
const serverBundle = require('/dist/vue-ssr-server-bundle.json')
const clientManifest = require('/dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(serverBundle, {
  template,
  clientManifest
})
import createApp from './app'
server.get('*', (req, res) => {
  const context = {
    title: 'demo'
  }
  let app = createApp(context)
  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

server.listen(8080)