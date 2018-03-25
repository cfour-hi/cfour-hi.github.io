import Vue from 'vue'
import Router from 'vue-router'
import { navsRepo } from './config'

const MainContainer = () => import('@comp/MainContainer')
const BlogArticles = () => import('@comp/BlogArticles')
const WorklogArticles = () => import('@comp/WorklogArticles')
const StudyArticles = () => import('@comp/StudyArticles')
const Article = () => import('@comp/Article')

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'app',
    redirect: '/article',
  },
  {
    path: '/article',
    component: MainContainer,
    meta: {
      nav: {
        name: 'article',
        icon: 'fa-chrome',
      },
    },
    children: [
      {
        path: '',
        name: BlogArticles.name,
        component: BlogArticles,
        meta: {
          name: 'blog',
          repository: navsRepo.blog,
        },
      },
      {
        path: ':number',
        name: `blog-${Article.name}`,
        component: Article,
        meta: {
          name: 'blog',
          repository: navsRepo.blog,
        },
      },
    ],
  },
  {
    path: '/worklog',
    component: MainContainer,
    meta: {
      nav: {
        name: 'worklog',
        icon: 'fa-internet-explorer',
      },
    },
    children: [
      {
        path: '',
        name: WorklogArticles.name,
        component: WorklogArticles,
        meta: {
          name: 'worklog',
          repository: navsRepo.worklog,
        },
      },
      {
        path: ':number',
        name: `worklog-${Article.name}`,
        component: Article,
        meta: {
          name: 'worklog',
          repository: navsRepo.worklog,
        },
      },
    ],
  },
  {
    path: '/study',
    component: MainContainer,
    meta: {
      nav: {
        name: 'study',
        icon: 'fa-firefox',
      },
    },
    children: [
      {
        path: '',
        name: StudyArticles.name,
        component: StudyArticles,
        meta: {
          name: 'study',
          repository: navsRepo.study,
        },
      },
      {
        path: ':number',
        name: `study-${Article.name}`,
        component: Article,
        meta: {
          name: 'study',
          repository: navsRepo.study,
        },
      },
    ],
  },
]

export default new Router({ routes })
