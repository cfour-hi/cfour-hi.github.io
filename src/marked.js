import marked from 'marked'
import hljs from 'highlight.js'

const renderer = new marked.Renderer()
renderer.link = (href, title, text) => `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`

hljs.configure({ languages: ['html', 'css', 'js', 'json', 'bash', 'shell'] })

marked.setOptions({
  renderer,
  highlight: code => hljs.highlightAuto(code).value,
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: true,
  smartypants: true,
})
