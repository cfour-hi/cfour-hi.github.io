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
        <div class="article-body">
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

export default {
  name: 'blog-articles',
  components: { BlogArticlesPlaceholder, ArticleMeta, LoadMore },
  data () {
    return {
      isLoading: false,
      hasMoreArticle: false,
    }
  },
  computed: {
    articles () {
      return this.$store.state.articles[this.$route.meta.nav.key]
    },
  },
  mounted () {
    this.handleLoadArticles()
  },
  beforeDestroy () {
    paging.page = 1
  },
  methods: {
    handleLoadArticles () {
      this.isLoading = true

      this.$store.dispatch('loadArticles', { paging, nav: this.$route.meta.nav })
        .then(articles => {
          this.isLoading = false

          const articlesLength = articles.length
          this.hasMoreArticle = articlesLength && articlesLength % paging.size === 0

          if (this.hasMoreArticle) paging.page += 1
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
</style>

<style>
.blog-articles .article-summary > :first-child {
  margin: 0.5em 0;
}
</style>
