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
        append
      >
        <div class="article-thumb-wrap">
          <img :src="article.thumb" alt="thumb" class="article-thumb">
        </div>
        <div class="article-container">
          <h2 class="article-title">{{ article.title }}</h2>
          <blockquote v-html="article.summary" class="article-summary"></blockquote>
          <article-meta :article="article"></article-meta>
        </div>
      </router-link>
    </ul>
    <load-more
      :visible="!!articles.length && hasMoreArticle"
      :loading="isLoading"
      @load="handleLoadArticles"
    >
    </load-more>
    <div v-show="articles.length && !hasMoreArticle" class="baseline" data-text="没有更多文章"></div>
  </div>
</template>

<script>
import BlogArticlesPlaceholder from './BlogArticlesPlaceholder'
import LoadMore from './LoadMore'

const ArticleMeta = () => import('./ArticleMeta')
const paging = { page: 1, size: 9 }
let hasMoreArticle = false
let scrollTop = 0

export default {
  name: 'blog-articles',
  components: { BlogArticlesPlaceholder, ArticleMeta, LoadMore },
  data () {
    return {
      hasMoreArticle,
      isLoading: false,
    }
  },
  computed: {
    articles () {
      return this.$store.state.articles[this.$route.meta.nav.key]
    },
  },
  // TODO：beforeRouteEnter & beforeRouteLeave 抽象到 mixin
  beforeRouteEnter (to, from, next) {
    next()
    setTimeout(() => {
      document.scrollingElement.scrollTop = scrollTop
    }, 700) // 页面切换动画时间是 500ms
  },
  beforeRouteLeave (to, from, next) {
    scrollTop = document.scrollingElement.scrollTop
    next()
  },
  mounted () {
    if (this.articles.length) return
    this.handleLoadArticles()
  },
  methods: {
    handleLoadArticles () {
      this.isLoading = true

      this.$store.dispatch('loadArticles', { paging, nav: this.$route.meta.nav })
        .then(articles => {
          this.isLoading = false

          const articlesLength = articles.length
          this.hasMoreArticle = hasMoreArticle = articlesLength && articlesLength % paging.size === 0

          if (hasMoreArticle) paging.page += 1
        })
    },
  },
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
  background-color: #fff;
  cursor: pointer;
  transition: all 0.15s ease-out;
}

.article-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px -15px rgba(0, 0, 0, 0.5);
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
  background-color: #fff;
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

.article-container {
  display: flex;
  flex-direction: column;
  flex: auto;
}

.article-title {
  margin: 0;
  font-size: 18px;
  transition: all 0.3s;
}

.article-summary {
  overflow: hidden;
  display: -webkit-box;
  flex: 0 0 6em;
  padding: 0;
  border-left: none;
  margin: 0 0 0.5em;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>

<style>
.blog-articles .article-summary > :first-child {
  margin: 0.5em 0;
}
</style>
