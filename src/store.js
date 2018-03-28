import Vue from 'vue'
import Vuex from 'vuex'
import { navsRepo } from '@/config'
import { getArticlesByRepoName } from '@/api'

Vue.use(Vuex)

const articles = {}
Object.keys(navsRepo).forEach(key => (articles[key] = []))

export default new Vuex.Store({
  state: {
    articles,
    comments: {},
  },
  mutations: {
    updateArticles (state, { key, articles }) {
      state.articles[key] = [...state.articles[key], ...articles]
    },
    updateCommentsByID (state, { id, comments }) {
      state.comments[id] = comments
    },
  },
  actions: {
    loadArticles ({ commit }, { paging, nav }) {
      return getArticlesByRepoName(nav.repo, paging.page, paging.size)
        .then(articles => {
          articles = articles.map(nav.resolveArticle)
          commit('updateArticles', { articles, key: nav.key })
          return articles
        })
    },
  },
})
