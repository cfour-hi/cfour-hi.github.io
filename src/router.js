import Vue from 'vue'
import Router from 'vue-router'
import { articleRepos } from './config'

const MainContainer = () => import('./components/MainContainer')
const BlogArticles = () => import('./components/BlogArticles')
const WorklogArticles = () => import('./components/WorklogArticles')
const StudyArticles = () => import('./components/StudyArticles')
const Article = () => import('./components/Article')

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
        component: BlogArticles,
        meta: {
          repository: articleRepos[0]
        }
      },
      {
        path: ':number',
        name: `${articleRepos[0].key}-${Article.name}`,
        component: Article,
        meta: {
          repository: articleRepos[0]
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
        name: WorklogArticles.name,
        component: WorklogArticles,
        meta: {
          repository: articleRepos[1]
        }
      },
      {
        path: ':number',
        name: `${articleRepos[1].key}-${Article.name}`,
        component: Article,
        meta: {
          repository: articleRepos[1]
        }
      }
    ]
  },
  {
    path: '/study',
    component: MainContainer,
    meta: {
      nav: {
        name: 'STUDY',
        icon: 'fa-firefox'
      }
    },
    children: [
      {
        path: '',
        name: StudyArticles.name,
        component: StudyArticles,
        meta: {
          repository: articleRepos[2]
        }
      },
      {
        path: ':number',
        name: `${articleRepos[2].key}-${Article.name}`,
        component: Article,
        meta: {
          repository: articleRepos[2]
        }
      }
    ]
  }
]

export default new Router({ routes })
