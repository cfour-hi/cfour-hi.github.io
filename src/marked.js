import marked from 'marked'
import hljs from 'highlight.js'

const renderer = new marked.Renderer()
renderer.link = (href, title, text) => `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer" class="hover-underline-animation">${text}</a>`

hljs.configure({ languages: ['base', 'html', 'css', 'js'] })

marked.setOptions({
  renderer,
  highlight: code => hljs.highlightAuto(code).value,
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: true,
  smartypants: true,
})
