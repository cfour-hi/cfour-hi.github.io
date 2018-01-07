<template>
  <div class="article-meta">
    <i class="fa fa-calendar" aria-hidden="true"></i>
    <span>{{ article.createdAt }}</span>
    <i class="fa fa-commenting" aria-hidden="true"></i>
    <span>{{ article.comments }}</span>
    <i v-show="!!article.labels.length" class="fa fa-tag" aria-hidden="true"></i>
    <span v-for="label of article.labels" :key="label.id" :style="{ color: `#${label.color}`}">{{ label.name }}</span>
  </div>
</template>

<script>
export default {
  name: 'blog-article-meta',

  props: {
    article: { required: true, type: Object }
  }
}
</script>

<style scoped>
.article-meta {
  font-size: 12px;
  color: #919191;
}

.article-meta .fa {
  margin-right: 0.2em;
}

.article-meta .fa:not(:first-child) {
  margin-left: 1em;
}
</style>

