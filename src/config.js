import BlogArticles from './components/BlogArticles'
import WorklogArticles from './components/WorklogArticles'
import StudyArticles from './components/StudyArticles'
import { convertBlogArticle, convertWorklogArticle, convertStudyArticle } from './util'

export const keepAliveComps = [
  BlogArticles.name,
  WorklogArticles.name,
  StudyArticles.name
]

export const articleRepos = [
  { key: 'blog', name: 'monine.github.io', resolveArticle: convertBlogArticle },
  { key: 'worklog', name: 'worklog', resolveArticle: convertWorklogArticle },
  { key: 'study', name: 'study', resolveArticle: convertStudyArticle }
]
