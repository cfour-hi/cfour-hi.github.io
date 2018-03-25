import Vue from 'vue'
import Vuex from 'vuex'
import { navsRepo } from './config'

Vue.use(Vuex)

const articles = {}
Object.keys(navsRepo).forEach(key => (articles[key] = []))

export default new Vuex.Store({
  state: {
    articles,
    comments: {},
  },

  mutations: {
    updateSpecifyArticles (state, { key, articles }) {
      state.articles[key] = articles
    },

    updateCommentsByID (state, { id, comments }) {
      state.comments[id] = comments
    },
  },
})
