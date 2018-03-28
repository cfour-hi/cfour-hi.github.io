import Vue from 'vue'
import Router from 'vue-router'
import { navsRepo } from './config'

const Home = () => import('@comp/Home')
const MainContainer = () => import('@comp/MainContainer')
const BlogArticles = () => import('@comp/BlogArticles')
const WorklogArticles = () => import('@comp/WorklogArticles')
const StudyArticles = () => import('@comp/StudyArticles')
const Article = () => import('@comp/Article')

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'app-home',
    component: Home,
  },
  {
    path: '/article',
    component: MainContainer,
    children: [
      {
        path: '',
        name: BlogArticles.name,
        component: BlogArticles,
        meta: {
          nav: navsRepo.blog,
        },
      },
      {
        path: ':number',
        name: `blog-${Article.name}`,
        component: Article,
        meta: {
          nav: navsRepo.blog,
        },
      },
    ],
  },
  {
    path: '/worklog',
    component: MainContainer,
    children: [
      {
        path: '',
        name: WorklogArticles.name,
        component: WorklogArticles,
        meta: {
          nav: navsRepo.worklog,
        },
      },
      {
        path: ':number',
        name: `worklog-${Article.name}`,
        component: Article,
        meta: {
          nav: navsRepo.worklog,
        },
      },
    ],
  },
  {
    path: '/study',
    component: MainContainer,
    children: [
      {
        path: '',
        name: StudyArticles.name,
        component: StudyArticles,
        meta: {
          nav: navsRepo.study,
        },
      },
      {
        path: ':number',
        name: `study-${Article.name}`,
        component: Article,
        meta: {
          nav: navsRepo.study,
        },
      },
    ],
  },
]

export default new Router({ routes })
