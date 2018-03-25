import marked from 'marked'

export const convertBlogArticle = function (article) {
  const articleBody = marked(article.body)
  const summary = articleBody.split(/<!--\s*summary\s*-->/g)[1]
  const splitBanner = articleBody.split(/<!--\s*banner\s*-->/g)
  const banner = splitBanner[1].match(/http[^"]+/)[0]
  const thumb = banner.replace(/(750|1024\*1024)$/, '256')
  const body = splitBanner[2]

  return Object.assign(article, {
    body,
    summary,
    thumb,
    banner,
    createdAt: article.created_at.split('T')[0],
  })
}

export const convertWorklogArticle = function (article) {
  const color = `#${article.labels[0].color}`
  const sections = marked(article.body).split(/<!--\s*summary\s*-->/g)

  return Object.assign(article, {
    color,
    createdAt: article.created_at.split('T')[0],
    year: article.labels[0].name,
    month: parseInt(article.title, 10),
    summary: sections[1],
    body: sections[2],
  })
}

export const convertStudyArticle = function (article) {
  const body = marked(article.body)

  return Object.assign(article, {
    body,
    createdAt: article.created_at.split('T')[0],
  })
}

export const convertComment = function (comment) {
  return Object.assign(comment, {
    createdAt: comment.created_at.replace(/T|Z/g, ' '),
    body: marked(comment.body),
  })
}
