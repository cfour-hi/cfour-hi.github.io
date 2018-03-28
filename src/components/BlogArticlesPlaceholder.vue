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
