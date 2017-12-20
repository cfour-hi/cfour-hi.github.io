<template>
  <main id="app-main">
    <slot name="app-nav"></slot>
    <router-view></router-view>
  </main>
</template>

<script>
export default {
  name: 'app-main',

  data () {
    return {

    }
  }
}
</script>

