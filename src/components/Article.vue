<template>
  <section class="article-list-page">
    <ul class="article-list">
      <li class="article-list__item-li" v-for="article in articleListInfo">
        <h2 class="article-list__item-title">
          <a v-link="{ name: 'article-content', params: { num: article.number }}">{{ article.title}}</a>
        </h2>
        <em class="article-list__item-time">- Create at {{ article._createdAt }} && Update at {{ article._updatedAt }}</em>
        {{{ article._quote }}}
        <a class="article-list__read article-list__read-btn" v-link="{ name: 'article-content', params: { num: article.number }}">READ</a>
        <p class="article-list__item-tags">
          <em>- Tags:</em>
          <a href="#" class="article-info__label" v-for="label in article.labels">{{ label.name }}</a>
        </p>
      </li>
    </ul>
    <button class="article-list__more article-list__read-btn" type="button" v-if="articleListInfo.length && hasMoreArticle" @click="moreArticle">MORE</button>
    <p class="article-list__no-more" v-if="articleListInfo.length && !hasMoreArticle">没有更多的文章</p>
  </section>
</template>

<script>
  import app, {cacheArticleList, pushCacheArticleList, addPrivateArticleAttr} from '../app.js'
  // cacheArticleList is read-only

  const prePage = 3

  export default {
    ready () {
      if (cacheArticleList.length) return (this.articleListInfo = cacheArticleList)

      this.getArticleList()
    },
    props: ['nextPage', 'hasMoreArticle'],
    data () {
      return {
        articleListInfo: []
      }
    },
    methods: {
      moreArticle () {
        if (!this.hasMoreArticle) return

        this.getArticleList()
      },
      getArticleList () {
        let _this = this

        this.$http.get(app.host + 'repos/' + app.owner + '/' + app.repo + '/issues', {
          params: {
            filter: 'created',
            page: this.nextPage,
            per_page: prePage,
            access_token: app.access_token
          }
        }).then((response) => {
          if (!response.data.length) return _this.$dispatch('update-has-more-article', false)

          // 添加文章内容所需属性
          // 添加文章列表缓存数据
          pushCacheArticleList(addPrivateArticleAttr(response.data))

          this.articleListInfo = cacheArticleList

          if (response.data.length < prePage) _this.$dispatch('update-has-more-article', false)

          this.$dispatch('update-next-page')
        })
      }
    }
  }
</script>

<style>
  .article-list-page {
    padding: 0.3rem 0;
  }
  .article-list {
    padding: 0;
  }
  .article-list__item-li {
    margin: 0.3rem 0;
    border-bottom: 1px dashed #ccc;
    font-size: 14px;
    list-style: none;
  }
  .article-list__item-li .article-list__item-title {
    margin-bottom: 0.05rem;
  }
  .article-list__item-li .article-list__item-title a {
    padding-bottom: 3px;
  }
  .article-list__item-li .article-list__item-title a:hover {
    border-bottom: 2px solid #333;
  }
  .article-list__item-li .article-list__item-time {
    font-size: 12px;
    color: #999;
  }
  .article-list__item-li .article-list__read {
    display: inline-block;
    margin: 0.1rem 0;
    border: 1px solid #0097da;
    color: #0097da;
  }
  .article-list__item-li .article-list__read:hover {
    color: #fff;
    background-color: #33ace1;
  }
  .article-list__item-li .article-list__read:active {
    background-color: #008fcf;
  }
  .article-list__item-li .article-list__item-tags {
    font-size: 12px;
    color: #f60;
  }
  .article-list__item-li .article-info__label {
    margin-left: 0.05rem;
    border-bottom: 1px solid #f60;
    color: inherit;
  }
  .article-list__item-li .article-info__label:hover {
    color: #ff8533;
  }
  .article-list__item-li .article-info__label:active {
    color: #f26100;
  }
  .article-list__more {
    border: 1px solid #f60;
    color: #f60;
    background-color: transparent;
    cursor: pointer;
  }
  .article-list__more:hover {
    color: #fff;
    background-color: #ff8533;
  }
  .article-list__more:active {
    background-color: #f26100;
  }
  .article-list__read-btn {
    position: relative;
    left: 50%;
    padding: 0.05rem 0.1rem;
    border-radius: 3px;
    font-size: 12px;
    -webkit-transition-property: color, background-color;
    transition-property: color, background-color;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .article-list__no-more {
    font-size: 12px;
    text-align: center;
    color: #999;
  }
</style>
