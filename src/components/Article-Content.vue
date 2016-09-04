<template>
  <section class="article-content-page">
    <article class="article-content">
      <header><h2 class="article-content__title">{{ articleInfo.title }}</h2></header>
      <p class="article-content__time" v-show="articleInfo._createdAt"><em>Create at {{ articleInfo._createdAt }} && Update at {{ articleInfo._updatedAt }}</em></p>
      <section class="article-content__body">{{{ articleInfo._body }}}</section>
    </article>
  </section>
</template>

<script>
  import app, {cacheArticleList, addPrivateArticleAttr} from '../app.js'

  export default {
    ready () {
      let _this = this
      let articleNum = +(this.articleNum)

      // 如果已经有缓存过文章数据则从文章数据内取出内容
      if (cacheArticleList.length) {
        for (let i = cacheArticleList.length - 1; i >= 0; i--) {
          if (cacheArticleList[i].number === articleNum) {
            this.articleInfo = cacheArticleList[i]
            return
          }
        }
      }

      // 获取单个 issues 内容，标识为 api 返回内容的 number 属性。
      this.$http.get(app['host'] + 'repos/' + app['owner'] + '/' + app['repo'] + '/issues/' + articleNum, {
        params: {
          access_token: app['access_token']
        }
      }).then((response) => {
        // 添加文章内容所需属性
        _this.articleInfo = addPrivateArticleAttr(response.data)
      })
    },
    props: ['articleNum'],
    data () {
      return {
        articleInfo: {}
      }
    }
  }
</script>

<style>
  .article-content__title {
    text-align: center;
    font-size: 24px;
  }
  .article-content__time {
    font-size: 14px;
    text-align: center;
    color: #999;
  }
  .article-content__body {
    margin: 0.5rem 0;
    font-size: 14px;
  }
  .article-content__body h2 {
    font-weight: 400;
  }
  .article-content__body a {
    color: #0097da;
  }
  .article-content__body a:hover {
    color: #33ace1;
  }
  .article-content__body a:active {
    color: #008fcf;
  }
</style>
