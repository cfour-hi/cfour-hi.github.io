import BlogArticles from './components/BlogArticles'
import WorklogArticles from './components/WorklogArticles'
import StudyArticles from './components/StudyArticles'

export const keepAliveComps = [
  BlogArticles.name,
  WorklogArticles.name,
  StudyArticles.name
]

export const articleRepos = [
  { key: 'blog', name: 'monine.github.io' },
  { key: 'worklog', name: 'worklog' },
  { key: 'study', name: 'study' }
]
