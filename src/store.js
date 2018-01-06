import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const BLOG_ARTICLES = 'blog-articles'
export const WORKLOGS = 'worklogs'
export const STUDY = 'study'

export default new Vuex.Store({
  state: {
    [BLOG_ARTICLES]: [],
    [WORKLOGS]: [],
    [STUDY]: []
  },
  mutations: {
    updateBlogArticles (state, { articles }) {
      state[BLOG_ARTICLES] = articles
    },

    updateWorklogs (state, { worklogs }) {
      state[WORKLOGS] = worklogs
    },

    updateStudyArticles (state, { articles }) {
      state[STUDY] = articles
    }
  }
})
