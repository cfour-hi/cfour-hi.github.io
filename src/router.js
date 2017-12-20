import Vue from 'vue'
import Router from 'vue-router'
import MainContainer from './components/MainContainer'

if (process.env.NODE_ENV === 'development') {
  Vue.use(Router)
}

export default new Router([
  {
    path: '/',
    redirect: '/article'
  },
  {
    path: '/article',
    component: MainContainer
  }
])
