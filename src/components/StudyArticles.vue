<template>
  <div>
    <study-articles-placeholder v-if="!articles.length"></study-articles-placeholder>
    <ul v-else class="articles">
      <router-link
        v-for="(article, index) of articles"
        :key="article.id"
        :to="`${article.number}`"
        tag="li"
        class="article-item"
        @mouseenter.native="activeIndex = index"
        append
      >
        <transition name="fade" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutLeft">
          <i v-show="index === activeIndex" class="fa fa-hand-o-right" aria-hidden="true"></i>
        </transition>
        {{ article.title }}
      </router-link>
    </ul>
  </div>
</template>

<script>
import StudyArticlesPlaceholder from './StudyArticlesPlaceholder'
import positionScroll from '@mixin/positionScroll'

const paging = { page: 1, size: 99 }

export default {
  name: 'stydy-articles',
  components: { StudyArticlesPlaceholder },
  mixins: [positionScroll],
  data () {
    return {
      activeIndex: -1,
    }
  },
  computed: {
    articles () {
      return this.$store.state.articles[this.$route.meta.nav.key]
    },
  },
  mounted () {
    if (this.articles.length) return
    this.$store.dispatch('loadArticles', { paging, nav: this.$route.meta.nav })
  },
}
</script>

<style scoped>
.articles {
  padding-left: 0;
  list-style: none;
}

.article-item {
  position: relative;
  padding: 0.5em 2.5em;
  margin-bottom: 0.8em;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.article-item:hover {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 3px rgba(0, 0, 0, 0.1);
}

.fa-hand-o-right {
  position: absolute;
  left: 1em;
  line-height: 1.9;
}
</style>
