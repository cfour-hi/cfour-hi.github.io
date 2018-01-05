import axios from 'axios'

axios.defaults.baseURL = 'https://api.github.com'
const OWNER = 'monine'
const ACCESS_TOKEN = '654f89e6030e8356063e' + '98c2782e58ac3ba53c3a'

axios.interceptors.request.use(config => {
  config.url += `${config.url.includes('?') ? '&' : '?'}access_token=${ACCESS_TOKEN}`
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response.data
}, error => {
  return Promise.reject(error)
})

export const getGithubIssuesByRepoName = function (name, page = 1, size = 5) {
  const params = { page, per_page: size, filter: 'created' }
  return axios.get(`/repos/${OWNER}/${name}/issues`, { params })
}

export const getArticleByNumber = function (repo, number) {
  return axios.get(`/repos/${OWNER}/${repo}/issues/${number}`)
}
