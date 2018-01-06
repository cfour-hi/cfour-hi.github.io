import Vue from 'vue'
import Vuex from 'vuex'
import { articleRepos } from './config'

Vue.use(Vuex)

const articles = {}
articleRepos.forEach(({ key }) => (articles[key] = []))

export default new Vuex.Store({
  state: {
    articles
  },

  mutations: {
    updateSpecifyArticles (state, { key, articles }) {
      state.articles[key] = articles
    }
  }
})
