import axios from 'axios'
import { accessToken } from '@/config'

axios.defaults.baseURL = 'https://api.github.com'
const OWNER = 'monine'

axios.interceptors.request.use(config => {
  config.url += `${config.url.includes('?') ? '&' : '?'}access_token=${accessToken}`
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response.data
}, error => {
  return Promise.reject(error)
})

export const getArticlesByRepoName = (name, page = 1, size = 5) => {
  const params = { page, per_page: size, filter: 'created' }
  return axios.get(`/repos/${OWNER}/${name}/issues`, { params })
}

export const getArticleByNumber = (repo, number) => {
  return axios.get(`/repos/${OWNER}/${repo}/issues/${number}`)
}

export const getArticleComments = (url, page = 1, size = 30) => {
  const params = { page, per_page: size }
  return axios.get(url, { params })
}
