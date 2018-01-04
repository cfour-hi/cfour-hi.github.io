import Vue from 'vue'
import Vuex from 'vuex'

if (process.env.NODE_ENV === 'development') {
  Vue.use(Vuex)
}

export const BLOG_ARTICLES = 'blog-articles'
export const WORKLOGS = 'worklogs'

export default new Vuex.Store({
  state: {
    progress: 'wait',
    [BLOG_ARTICLES]: [],
    [WORKLOGS]: []
  },
  mutations: {
    setProgress (state, { step }) {
      state.progress = step
    },

    updateBlogArticles (state, { articles }) {
      state[BLOG_ARTICLES] = articles
    },

    updateWorklogs (state, { worklogs }) {
      state[WORKLOGS] = worklogs
    }
  }
})
