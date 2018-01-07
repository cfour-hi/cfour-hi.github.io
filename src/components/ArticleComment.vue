<template>
  <div>
    <dl v-if="!!comments.length" class="comments">
      <dd v-for="comment of comments" :key="comment.id" class="comment-item">
        <a :href="comment.user.html_url" target="_blank" class="commenter-avatar-link">
          <img :src="comment.user.avatar_url" alt="avatar" class="commenter-avatar">
        </a>
        <div class="comment-header">
          <a :href="comment.user.html_url" target="_blank" class="commenter-name-link">
            <strong>{{ comment.user.login }}</strong>
          </a>
          <span class="comment-created">{{ comment.createdAt }}</span>
        </div>
        <article v-html="comment.body" class="comment-body"></article>
      </dd>
    </dl>
    <load-more
      :visible="!!comments.length && hasMoreComment"
      :loading="isLoading"
      @load="handleLoadComments">
    </load-more>
    <div v-show="!!comments.length && !hasMoreComment" class="baseline" data-text="没有更多评论"></div>
  </div>
</template>

<script>
import LoadMore from './LoadMore'
import { getArticleComments } from '../api'
import { convertComment } from '../util'

const paging = { page: 1, size: 30 }

export default {
  name: 'article-comment',

  components: { LoadMore },

  props: {
    article: { requires: true, type: Object }
  },

  data () {
    return {
      comments: [],
      isLoading: false
    }
  },

  computed: {
    storeComments () {
      return this.$store.state.comments
    },

    hasMoreComment () {
      return this.comments % paging.size === 0
    }
  },

  created () {
    const comments = this.storeComments[this.article.id]
    if (comments) return (this.comments = comments)

    this.handleLoadComments()
  },

  beforeDestroy () {
    paging.page = 1
  },

  methods: {
    handleLoadComments () {
      this.isLoading = true

      const { id, comments_url } = this.article
      getArticleComments(comments_url, paging.page, paging.size)
        .then(comments => {
          this.comments = [...this.comments, ...comments.map(convertComment)]
          this.isLoading = false
          paging.page += 1
          this.$store.commit('updateCommentsByID', { id, comments: this.comments })
        })
    }
  }
}
</script>

<style scoped>
.comments {
  padding: 1px 1em;
  background-color: rgba(255, 255, 255, 0.8);
}

.comment-item {
  position: relative;
  margin: 1em 0 1em 5em;
  border: 1px solid #d9d9d9;
}

.commenter-avatar-link {
  position: absolute;
  left: -5em;
}

.commenter-avatar {
  width: 4em;
  height: 4em;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0.5em 1em;
  border-bottom: 1px solid #d9d9d9;
  font-size: 12px;
  background: #f7f7f7;
}

.comment-header::before {
  content: "";
  position: absolute;
  top: 0.85em;
  left: -0.55em;
  width: 1em;
  height: 1em;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  background: #f7f7f7;
  transform: rotate(-45deg);
}

.commenter-name-link {
  text-decoration: none;
}

.comment-body {
  padding: 0 1em;
  font-size: 14px;
}
</style>
