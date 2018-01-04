import marked from 'marked'

export const convertBlogArticle = function (article) {
  const articleBody = marked(article.body)
  const summary = articleBody.split(/<!--\s*summary\s*-->/g)[1]
  const splitBanner = articleBody.split(/<!--\s*banner\s*-->/g)
  const banner = splitBanner[1].match(/http[^\\]+/)[0]
  const thumb = banner.replace(/750$/, '256')
  const body = splitBanner[2]

  return Object.assign(article, {
    body,
    summary,
    thumb,
    banner,
    createdAt: article.created_at.split('T')[0]
  })
}

export const convertWorklog = function (worklog) {
  const color = `#${worklog.labels[0].color}`
  const sections = marked(worklog.body).split(/<!--\s*summary\s*-->/g)

  return Object.assign(worklog, {
    color,
    createdAt: worklog.created_at.split('T')[0],
    year: worklog.labels[0].name,
    month: parseInt(worklog.title, 10),
    summary: sections[1],
    body: sections[2]
  })
}
