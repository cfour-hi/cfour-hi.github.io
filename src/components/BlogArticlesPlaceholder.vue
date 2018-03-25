<template>
  <div>
    <vue-content-loading v-for="r of size" :key="r" :width="784" :height="154">
      <rect x="7" y="7" rx="5" ry="5" width="175" height="140"></rect>
      <rect x="195" y="10" rx="5" ry="5" width="220" height="18"></rect>
      <rect x="195" y="50" rx="5" ry="5" width="581" height="12"></rect>
      <rect x="195" y="75" rx="5" ry="5" width="581" height="12"></rect>
      <rect x="195" y="100" rx="5" ry="5" width="350" height="12"></rect>
      <rect x="195" y="135" rx="5" ry="5" width="200" height="10"></rect>
    </vue-content-loading>
  </div>
</template>

<script>
import VueContentLoading from 'vue-content-loading'

export default {
  name: 'blog-articles-placeholder',
  components: { VueContentLoading },
  props: {
    size: { type: Number, default: 9 },
  },
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

