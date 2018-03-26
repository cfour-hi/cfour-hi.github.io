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
        <blockquote v-html="article.summary" class="article-summary"></blockquote>
      </template>
      <img v-if="article.banner" :src="article.banner" class="article-banner" alt="banner">
      <div v-html="article.body" class="article-body"></div>
    </article>
    <article-comment v-if="!!article.comments" :article="article"></article-comment>
  </div>
</template>

<script>
import ArticlePlaceholder from './ArticlePlaceholder'
import ArticleComment from './ArticleComment'
import { getArticleByNumber } from '@/api'

const ArticleMeta = () => import('./ArticleMeta')

export default {
  name: 'article',
  components: { ArticlePlaceholder, ArticleMeta, ArticleComment },
  data () {
    return {
      article: {},
    }
  },
  mounted () {
    document.scrollingElement.scrollTop = 0

    const { params, meta } = this.$route
    const num = parseInt(params.number, 10)
    const article = this.$store.state.articles[meta.nav.key]
      .find(({ number }) => number === num)

    if (article) return (this.article = article)

    const { rrepo, resolveArticle } = meta.nav
    getArticleByNumber(rrepo, num)
      .then(article => (this.article = resolveArticle(article)))
  },
}
</script>

<style scoped>
.article-container {
  padding: 2em;
  font-size: 14px;
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
  width: 95%;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow: 0 15px 30px -15px rgba(0, 0, 0, 0.9);
}

#article .article-body h3 {
  position: relative;
  line-height: 3;
}

#article .article-body h3::before {
  content: "";
  position: absolute;
  top: 0.8em;
  left: -0.8em;
  width: 5px;
  height: 1.4em;
  background-color: #f56a00;
}

#article .article-body blockquote {
  padding-left: 2em;
  margin-left: 0;
  border-left: 5px solid #e6e6e6;
  color: #999;
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
  padding: 0 3px;
  border-bottom: 1px dashed #aaa;
}

#article .article-body pre {
  overflow: auto;
  padding: 1em;
  margin: 0 auto 2em;
  border-radius: 5px;
  background-color: #282c34;
  box-shadow: 0 15px 30px -15px rgba(0, 0, 0, 0.9);
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
  color: #e6e6e6;
  background-color: transparent;
}
</style>
