<template>
  <div id="app-wrapper" class="app-wrapper">
    <header id="app-header" class="app-header">
      <h1><a v-link="{ path: '/' }">Monine</a></h1>
      <nav>
        <a v-link="{ path: '/article' }">文章</a>
        <!-- <a v-link="{ path: '/' }">关于我</a> -->
      </nav>
    </header>
    <div id="app-container" class="app-container">
      <router-view :next-page="nextPage" :has-more-article="hasMoreArticle" :article-num="$route.params.num" @update-next-page="updateNextPage" @update-has-more-article="updateHasMoreArticle"></router-view>
    </div>
    <footer id="app-footer" class="app-footer">
      <p>© 2016 Monine</p>
    </footer>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        nextPage: 1,
        hasMoreArticle: true
      }
    },
    methods: {
      updateNextPage () {
        this.nextPage += 1
      },
      updateHasMoreArticle (bool) {
        this.hasMoreArticle = bool
      }
    }
  }
</script>

<style scoped>
  .app-wrapper {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    width: 7rem;
    height: 100%;
    margin: auto;
  }
  .app-header {
    -webkit-flex: 0 0 auto;
    flex: 0 0 auto;
    position: relative;
    padding-bottom: 0.2rem;
    border-bottom: 1px solid #999;
  }
  .app-header nav {
    font-size: 14px;
  }
  .app-header nav a {
    padding: 3px;
  }
  .app-header nav .v-link-active {
    border-bottom: 2px solid #0097da;
  }
  .app-header nav a:hover {
    border-bottom: 2px solid #0097da;
  }
  .app-container {
    -webkit-flex: 1 0 auto;
    flex: 1 0 auto;
    width: 100%;
    margin: auto;
  }
  .app-footer {
    -webkit-flex: 0 0 auto;
    flex: 0 0 auto;
    border-top: 1px solid #999;
    text-align: center;
    font-size: 12px;
    color: #999;
  }
</style>