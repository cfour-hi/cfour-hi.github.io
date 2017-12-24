import axios from 'axios'
import store from './store'
import { repository } from './config'

axios.defaults.baseURL = 'https://api.github.com'
const OWNER = 'monine'
const ACCESS_TOKEN = '090bbff2743e2df29457' + 'd475ecec43be93c5fd57'

axios.interceptors.request.use(config => {
  store.commit('setProgress', { step: 'loading' })

  config.url += `${config.url.includes('?') ? '&' : '?'}access_token=${ACCESS_TOKEN}`
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  if (store.state.progress === 'loading') store.commit('setProgress', { step: 'success' })
  return response.data
}, error => {
  if (store.state.progress === 'loading') store.commit('setProgress', { step: 'error' })
  return Promise.reject(error)
})

export const getBlogArticles = function ({ page = 1, size = 5 }) {
  const params = { page, per_page: size, filter: 'created' }
  return axios.get(`/repos/${OWNER}/${repository.blog}/issues`, { params })
}

export const getArticleByNumber = function (repo, number) {
  return axios.get(`/repos/${OWNER}/${repo}/issues/${number}`)
}
