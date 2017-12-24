import Vue from 'vue'
import Router from 'vue-router'
import { repository } from './config'

const MainContainer = () => import('./components/MainContainer')
const BlogArticles = () => import('./components/BlogArticles')
const Article = () => import('./components/Article')

if (process.env.NODE_ENV === 'development') {
  Vue.use(Router)
}

const routes = [
  {
    path: '/',
    name: 'app',
    redirect: '/article'
  },
  {
    path: '/article',
    component: MainContainer,
    meta: {
      nav: {
        name: 'ARTICLE',
        icon: 'fa-chrome'
      }
    },
    children: [
      {
        path: '',
        name: 'blog-articles',
        component: BlogArticles
      },
      {
        path: ':number',
        name: 'blog-article',
        component: Article,
        meta: {
          repository: repository.blog
        }
      }
    ]
  },
  {
    path: '/worklog',
    component: MainContainer,
    meta: {
      nav: {
        name: 'WORKLOG',
        icon: 'fa-internet-explorer'
      }
    }
  }
]

export default new Router({ routes })
