import marked from 'marked'
import hljs from 'highlight.js'

const renderer = new marked.Renderer()
renderer.link = (href, title, text) => `<a href="${href}" title="${title || ''}" target="_blank">${text}</a>`

marked.setOptions({
  renderer,
  highlight: code => hljs.highlightAuto(code).value,
  breaks: true,
})
