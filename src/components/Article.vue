<template>
  <div id="article">
    <article-placeholder v-if="!article.id"></article-placeholder>
    <article v-else class="article-container">
      <div
      :style="{ backgroundColor: article.labels[0] ? `#${article.labels[0].color}` : '#00a0e9' }"
      class="article-border-top">
      </div>
      <h2 class="article-title">{{ article.title }}</h2>
      <article-meta :article="article"></article-meta>
      <template v-if="article.summary">
        <i class="fa fa-quote-left fa-3x fa-pull-left fa-border" aria-hidden="true"></i>
        <blockquote class="article-summary" v-html="article.summary"></blockquote>
      </template>
      <img v-if="article.banner" :src="article.banner" class="article-banner" alt="banner">
      <div v-html="article.body" class="article-body"></div>
    </article>
    <!-- <article-comment v-show="article.commentNum" :comment-url="article.commentUrl"></article-comment> -->
  </div>
</template>

<script>
import ArticlePlaceholder from './ArticlePlaceholder'
import { getArticleByNumber } from '../api'

const ArticleMeta = () => import('./ArticleMeta')

const findArticleByNumber = function () {
  const num = parseInt(this.$route.params.number, 10)
  return this.$store.state.articles[this.$route.meta.repository.key]
    .find(({ number }) => number === num)
}

export default {
  name: 'article',

  components: { ArticlePlaceholder, ArticleMeta },

  data () {
    return {
      article: {}
    }
  },

  created () {
    const article = findArticleByNumber.call(this)
    if (article) return (this.article = article)

    const { params, meta } = this.$route
    const { name, resolveArticle } = meta.repository
    getArticleByNumber(name, params.number)
      .then(article => (this.article = resolveArticle(article)))
  }
}
</script>

<style scoped>
.article-container {
  padding: 2em;
  font-size: 14px;
  color: #404040;
  background-color: rgba(255, 255, 255, 0.8);
}

.article-border-top {
  height: 3px;
  opacity: 0.3;
  margin: -2em -2em 0;
}

.article-title {
  font-size: 20px;
  text-align: center;
}

.article-summary {
  min-height: 6em;
  margin: 0;
  margin-bottom: 1em;
  border-bottom: 3px solid #f5f5f5;
}
</style>

<style>
#article .article-meta {
  margin-bottom: 1.2em;
  text-align: center;
}

#article .article-summary ol {
  padding-left: 7em;
  margin: 0;
}

#article .article-container img {
  display: block;
  margin: 0 auto;
  border-radius: 5px;
}

#article .article-body h3 {
  position: relative;
  padding-left: 1em;
  line-height: 3;
}

#article .article-body h3::before {
  content: "";
  position: absolute;
  top: 0.8em;
  left: 0;
  width: 5px;
  height: 1.4em;
  border-radius: 5px;
  background-color: #f56a00;
}

#article .article-body blockquote {
  padding: 1px 1em;
  margin-left: 0;
  margin-right: 0;
  border-left: 3px solid #7ec2f3;
  border-radius: 3px;
  font-size: 12px;
  background-color: #ecf6fd;
}

#article .article-body a {
  padding-bottom: 2px;
  border-bottom: 1px solid #919191;
  text-decoration: none;
}

#article .article-body a:hover {
  border-color: currentColor;
}

#article .article-body em {
  font-size: 12px;
}

#article .article-body pre {
  max-height: 50em;
  padding: 1em;
  border-radius: 5px;
  font-size: 12px;
  background-color: #404040;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

#article .article-body pre::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: transparent;
}

#article .article-body pre::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #bfbfbf;
}

#article .article-body pre::-webkit-scrollbar-corner {
  background-color: #fff;
}

#article .article-body pre code {
  padding: 0;
  font-size: 12px;
  color: #fff;
  background-color: transparent;
}
</style>
