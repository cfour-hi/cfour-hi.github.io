import marked from 'Marked'
import hljs from 'highlight.js'

marked.setOptions({
  highlight: (code) => {
    return hljs.highlightAuto(code).value
  }
})

const _config = {
  owner: 'monine',
  repo: 'study',
  host: 'https://api.github.com/',
  access_token: '2561b87868ac0da74ecbeabf983645bf06737329'
}

// 文章列表缓存
// 可以看作是一个全局变量
// 每次获取到文章列表数据之后都会使用 pushCacheArticleList 方法添加新内容
let cacheArticleList = []

// 添加文章列表缓存
// 往 cacheArticleList 内添加当前获取到的文章列表数据
let pushCacheArticleList = (list) => (cacheArticleList = cacheArticleList.concat(list))

// 添加文章内容所需属性
let addPrivateArticleAttr = (articleInfo) => {
  let _articleInfo = []
  let _isArray

  Array.isArray(articleInfo) ? _isArray = true : _isArray = false

  _isArray ? (_articleInfo = _articleInfo.concat(articleInfo)) : _articleInfo.push(articleInfo)

  for (let i = _articleInfo.length - 1; i >= 0; i--) {
    _articleInfo[i]._createdAt = _articleInfo[i].created_at.split('T')[0]
    _articleInfo[i]._updatedAt = _articleInfo[i].updated_at.split('T')[0]
    _articleInfo[i]._body = marked(_articleInfo[i].body)
    _articleInfo[i]._quote = _articleInfo[i]._body.split('<!-- more -->')[0].trim()
  }

  return _isArray ? _articleInfo : _articleInfo[0]
}

// 默认输出配置信息
export default _config

export {cacheArticleList, pushCacheArticleList, addPrivateArticleAttr}
