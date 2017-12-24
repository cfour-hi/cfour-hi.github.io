import marked from 'marked'

export function convertBlogArticle (article) {
  const articleBody = marked(article.body)
  const summary = articleBody.split(/<!--\s*summary\s*-->/g)[1]
  const splitBanner = articleBody.split(/<!--\s*banner\s*-->/g)
  const banner = splitBanner[1].match(/http[^\\]+/)[0]
  const body = splitBanner[2]

  return Object.assign(article, {
    body,
    summary,
    banner,
    createdAt: article.created_at.split('T')[0]
  })
}
