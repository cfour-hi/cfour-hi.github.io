import Vue from 'vue'
import Vuex from 'vuex'

if (process.env.NODE_ENV === 'development') {
  Vue.use(Vuex)
}

export default new Vuex.Store({
  state: {
    progress: 'wait',
    blogArticles: []
  },
  mutations: {
    setProgress (state, { step }) {
      state.progress = step
    },

    updateBlogArticles (state, { articles }) {
      state.blogArticles = articles
    }
  }
})
