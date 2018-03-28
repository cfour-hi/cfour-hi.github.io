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
      <blockquote v-if="article.summary" v-html="article.summary"></blockquote>
      <img v-if="article.banner" :src="article.banner" alt="banner">
      <div v-html="article.body" ref="article" class="article-body"></div>
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

    const { repo, resolveArticle } = meta.nav
    getArticleByNumber(repo, num)
      .then(article => (this.article = resolveArticle(article)))
  },
}
</script>

<style scoped>
.article-container {
  padding: 2em;
  font-size: 14px;
  background-color: #fff;
}

.article-meta {
  margin-bottom: 1.2em;
  text-align: center;
}

.article-border-top {
  position: relative;
  height: 2em;
  margin: -2em -2em 0;
}

.article-border-top::after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 1.5em;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxLjQxNCI+PHBhdGggZD0iTTEyIDEybDEyIDEySDBsMTItMTJ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+);
}

.article-title {
  margin: 1em 0 0.5em;
  font-size: 22px;
  text-align: center;
}
</style>
