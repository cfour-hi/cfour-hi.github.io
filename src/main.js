// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import marked from 'marked'
import hljs from 'highlight.js'

if (process.env.NODE_ENV === 'development') {
  import('font-awesome/css/font-awesome.css')
  import('animate.css')
}

Vue.config.productionTip = false

const renderer = new marked.Renderer()
renderer.link = (href, title, text) => `<a href="${href}" title="${title || ''}" target="_blank">${text}</a>`

marked.setOptions({
  renderer,
  highlight: code => hljs.highlightAuto(code).value,
  breaks: true
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  template: '<App/>',
  components: { App }
})
