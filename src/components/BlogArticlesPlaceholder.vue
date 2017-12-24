<template>
  <ul id="blog-articles-placeholder">
    <li v-for="item of size" :key="item" class="item">
      <div class="thumb"></div>
      <div class="body">
        <div class="title"></div>
        <div>
          <div v-for="paragraph of 3" :key="paragraph" class="paragraph"></div>
        </div>
        <div class="meta"></div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'blog-articles-placeholder',

  props: {
    size: { type: Number, default: 5 }
  },

  data () {
    return {}
  }
}
</script>

<style scoped>
#blog-articles-placeholder {
  padding-left: 0;
  margin-top: 0;
  font-size: 14px;
}

.item {
  display: flex;
  padding: 0.5em;
  margin-bottom: 1em;
  background-color: rgba(255, 255, 255, 0.8);
}

.thumb {
  flex: 0 0 12.5em;
  height: 10em;
  border-radius: 5px;
  margin-right: 1em;
  background-color: rgba(0, 0, 0, 0.1);
}

.body {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.title {
  margin: 0.43em 0;
  width: 50%;
  height: 16px;
  background-color: rgba(0, 0, 0, 0.15);
}

.paragraph {
  height: 1em;
  margin: 0.8em 0;
  border-radius: 0.5em;
  background-color: rgba(0, 0, 0, 0.1);
}

.summary-item:last-child {
  width: 70%;
}

.meta {
  width: 30%;
  height: 1em;
  margin-top: 1em;
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.07);
}
</style>

