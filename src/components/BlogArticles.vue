<template>
  <div id="blog-articles">
    <blog-articles-placeholder v-if="!articles.length"></blog-articles-placeholder>
    <ul v-else class="blog-articles">
      <router-link
        v-for="article of articles"
        :key="article.id"
        :to="`${article.number}`"
        tag="li"
        class="article-item"
        append>
        <div class="article-thumb-wrap">
          <img :src="article.banner" alt="" class="article-thumb">
        </div>
        <div class="article-body">
          <h2 class="article-title">{{ article.title }}</h2>
          <blockquote v-html="article.summary" class="article-summary"></blockquote>
          <article-meta :article="article"></article-meta>
        </div>
      </router-link>
    </ul>
    <div v-show="!!articles.length && hasMoreArticle" class="load-more-article" @click="handleLoadArticles">
      <i v-show="isLoading" class="fa fa-spinner fa-spin fa-fw"></i>
      <span v-show="!isLoading">加载更多</span>
    </div>
    <div v-show="!!articles.length && !hasMoreArticle" class="baseline" data-text="没有更多文章"></div>
  </div>
</template>

<script>
import BlogArticlesPlaceholder from './BlogArticlesPlaceholder'
import { getArticlesByRepoName } from '../api'

const ArticleMeta = () => import('./ArticleMeta')
const paging = { page: 1, size: 5 }

export default {
  name: 'blog-articles',

  components: { BlogArticlesPlaceholder, ArticleMeta },

  data () {
    return {
      articles: [],
      isLoading: false
    }
  },

  computed: {
    hasMoreArticle () {
      return this.articles.length % paging.size === 0
    }
  },

  created () {
    this.handleLoadArticles()
  },

  methods: {
    handleLoadArticles () {
      this.isLoading = true

      const { resolveArticle, key: repoKey, name: repoName } = this.$route.meta.repository
      getArticlesByRepoName(repoName, paging.page, paging.size)
        .then(articles => {
          articles.forEach(resolveArticle)

          this.articles = [...this.articles, ...articles]
          this.isLoading = false
          paging.page += 1

          this.$store.commit('updateSpecifyArticles', { key: repoKey, articles: this.articles })
        })
    }
  }
}
</script>

<style scoped>
.blog-articles {
  padding-left: 0;
  margin-top: 0;
  font-size: 14px;
  color: #5a5a5a;
}

.article-item {
  display: flex;
  padding: 0.5em;
  margin-bottom: 1em;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.article-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.article-thumb-wrap {
  overflow: hidden;
  flex: 0 0 12.5em;
  height: 10em;
  border-radius: 5px;
  margin-right: 1em;
  background-color: #e9e9e9;
}

.article-item:hover .article-thumb-wrap {
  background-color: rgba(255, 255, 255, 0.8);
}

.article-thumb {
  height: 10em;
  object-fit: cover;
  transition: all 0.3s;
}

.article-item:hover .article-thumb {
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
}

.article-item:hover .article-thumb:hover {
  transform: scale(1.05) rotate(3deg);
}

.article-body {
  display: flex;
  flex-direction: column;
}

.article-title {
  margin: 0;
  font-size: 16px;
  transition: all 0.3s;
}

.article-item:hover .article-title {
  transform: translateX(0.5em);
}

.article-summary {
  overflow: hidden;
  display: -webkit-box;
  flex: 0 0 6em;
  margin: 0 0 0.5em;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.load-more-article {
  margin-bottom: 1em;
  font-size: 14px;
  line-height: 2.5;
  text-align: center;
  color: #919191;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.load-more-article:hover {
  color: #5a5a5a;
  background-color: #e9e9e9;
}
</style>

<style>
.blog-articles .article-summary > :first-child {
  margin: 0.5em 0;
}
</style>
