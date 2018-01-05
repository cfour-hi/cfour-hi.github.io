import Vue from 'vue'
import Router from 'vue-router'
import { repository } from './config'
import { BLOG_ARTICLES, WORKLOGS } from './store'
import { convertBlogArticle, convertWorklog } from './assets/js/app'

const MainContainer = () => import('./components/MainContainer')
const BlogArticles = () => import('./components/BlogArticles')
const Article = () => import('./components/Article')
const Worklogs = () => import('./components/Worklogs')

Vue.use(Router)

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
        name: BlogArticles.name,
        component: BlogArticles
      },
      {
        path: ':number',
        name: `blog-${Article.name}`,
        component: Article,
        meta: {
          repository: repository.blog,
          store: BLOG_ARTICLES,
          convert: convertBlogArticle
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
    },
    children: [
      {
        path: '',
        name: Worklogs.name,
        component: Worklogs
      },
      {
        path: ':number',
        name: `worklog-${Article.name}`,
        component: Article,
        meta: {
          repository: repository.worklog,
          store: WORKLOGS,
          convert: convertWorklog
        }
      }
    ]
  }
]

export default new Router({ routes })
