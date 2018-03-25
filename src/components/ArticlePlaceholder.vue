<template>
  <article>
    <vue-content-loading :width="784" :height="85">
      <rect x="267" y="25" rx="5" ry="5" width="250" height="20"></rect>
      <rect x="292" y="75" rx="5" ry="5" width="200" height="10"></rect>
    </vue-content-loading>
    <vue-content-loading :width="784" :height="370">
      <rect x="28" y="14" rx="5" ry="5" width="70" height="70"></rect>
      <rect x="110" y="23" rx="5" ry="5" width="650" height="12"></rect>
      <rect x="110" y="50" rx="5" ry="5" width="650" height="12"></rect>
      <rect x="110" y="75" rx="5" ry="5" width="650" height="12"></rect>
      <rect x="28" y="100" rx="5" ry="5" width="300" height="12"></rect>
      <rect x="28" y="130" rx="5" ry="5" width="730" height="3"></rect>
      <rect x="28" y="150" rx="5" ry="5" width="730" height="200"></rect>
    </vue-content-loading>
    <vue-content-loading v-for="r of 5" :key="r" :width="784" :height="130">
      <rect x="28" y="0" rx="5" ry="5" width="200" height="16"></rect>
      <rect x="28" y="30" rx="5" ry="5" width="650" height="12"></rect>
      <rect x="28" y="60" rx="5" ry="5" width="730" height="12"></rect>
      <rect x="28" y="90" rx="5" ry="5" width="500" height="12"></rect>
    </vue-content-loading>
  </article>
</template>

<script>
import VueContentLoading from 'vue-content-loading'

export default {
  name: 'article-placeholder',
  components: { VueContentLoading },
}
</script>
