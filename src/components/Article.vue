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

<style>
#article .article-container h2,
#article .article-container h3,
#article .article-container h4 {
  margin: 2em 0 1em;
}

#article .article-container p,
#article .article-container ul,
#article .article-container ol {
  margin: 1em 0 2em;
}

#article .article-container img,
#article .article-container .article-body .pre-code {
  margin: 1.5em auto 3em;
  border-radius: 8px;
  box-shadow: 0 15px 30px -15px rgba(0, 0, 0, 0.9);
}

#article .article-container img {
  display: block;
  max-width: 92%;
  border-top: 1px solid #f9f9f9;
}

#article .article-container h3 {
  position: relative;
  font-size: 18px;
}

#article .article-container h3::before {
  content: "";
  position: absolute;
  top: 0.4em;
  left: -0.8em;
  width: 5px;
  height: 1.05em;
  background-color: #f66;
}

#article .article-container h4 {
  font-size: 16px;
}

#article .article-container blockquote {
  padding-left: 2em;
  margin: 2em 0;
  border-left: 5px solid #e6e6e6;
  color: #999;
}

#article .article-container ul,
#article .article-container ol {
  padding-left: 1em;
  list-style-type: none;
}

#article .article-container li {
  position: relative;
}

#article .article-container li::before {
  content: "·";
  position: absolute;
  top: -0.5em;
  left: -0.5em;
  margin: 0;
  font-size: 1.8em;
  font-weight: 600;
  color: #999;
}

#article .article-container li p {
  margin-bottom: 1em;
}

#article .article-container a {
  color: #f66;
  padding-bottom: 2px;
  text-decoration: none;
}

#article .article-container a:hover {
  color: #f33;
  border-color: currentColor;
}

#article .article-container em {
  color: #666;
}

#article .article-container pre {
  overflow: auto;
  padding: 1.5em;
  margin-top: 0;
  border-radius: 0 0 8px 8px;
  font-size: 12px;
  background-color: #282c34;
  -webkit-overflow-scrolling: touch;
}

#article .article-container pre::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: transparent;
}

#article .article-container pre::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #ccc;
}

#article .article-container pre::-webkit-scrollbar-corner {
  background-color: #fff;
}

#article .article-container pre code {
  padding: 0;
  margin: 0;
  color: #e6e6e6;
  background-color: transparent;
}

#article .article-body .pre-code {
  border-radius: 8px;
  box-shadow: 0 15px 30px -15px rgba(0, 0, 0, 0.9);
}

#article .pre-code .header {
  position: relative;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #999;
  border-radius: 8px 8px 0 0;
  height: 2em;
  font-weight: 500;
  text-align: center;
  color: #666;
  text-shadow: 0 1px #eee;
  background-color: #ccc;
  background-image: linear-gradient(#eee, #ccc);
}

#article .pre-code .header i {
  position: absolute;
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  top: 0.55em;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}

#article .pre-code .header i:nth-child(1) {
  left: 1em;
  background-color: #f55;
}

#article .pre-code .header i:nth-child(2) {
  left: 2.5em;
  background-color: #fb4;
}

#article .pre-code .header i:nth-child(3) {
  left: 4em;
  background-color: #3c4;
}
</style>
