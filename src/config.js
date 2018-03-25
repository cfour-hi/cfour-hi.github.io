import BlogArticles from './components/BlogArticles'
import WorklogArticles from './components/WorklogArticles'
import StudyArticles from './components/StudyArticles'
import { convertBlogArticle, convertWorklogArticle, convertStudyArticle } from './helper'

export const keepAliveComps = [
  BlogArticles.name,
  WorklogArticles.name,
  StudyArticles.name,
]

export const navsRepo = {
  blog: { name: 'monine.github.io', resolveArticle: convertBlogArticle },
  worklog: { name: 'worklog', resolveArticle: convertWorklogArticle },
  study: { name: 'study', resolveArticle: convertStudyArticle },
}
