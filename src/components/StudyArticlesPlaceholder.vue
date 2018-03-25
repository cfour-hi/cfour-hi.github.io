<template>
  <vue-content-loading :width="784" :height="900">
    <rect
      v-for="(r, index) of size"
      :key="r"
      x="35"
      :y="50 * index + 12"
      rx="5"
      ry="5"
      :width="parseInt(Math.random() * 300, 10) + 150"
      height="12">
    </rect>
  </vue-content-loading>
</template>

<script>
import VueContentLoading from 'vue-content-loading'

export default {
  name: 'study-articles-placeholder',
  components: { VueContentLoading },
  props: {
    size: { type: Number, default: 19 },
  },
}
</script>
