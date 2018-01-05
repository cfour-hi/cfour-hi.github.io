<template>
  <div>
    <vue-content-loading v-for="l of 2" :key="l" :width="720" :height="178">
      <rect x="32" y="40" width="720" height="1"></rect>
      <circle cx="24" cy="40" r="24"></circle>
      <circle v-for="(c, index) of 12" :key="c" :cx="48 + c * 42 + index * 12" cy="40" r="11"></circle>
      <rect x="42" y="64" rx="5" ry="5" width="678" height="100"></rect>
    </vue-content-loading>
  </div>
</template>

<script>
import VueContentLoading from 'vue-content-loading'

export default {
  name: 'worklog-placeholder',

  components: { VueContentLoading },

  data () {
    return {}
  }
}
</script>

