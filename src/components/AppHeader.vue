<template>
  <header id="app-header">
    <router-link to="/" tag="h1" class="bloger-name">MONINE</router-link>
  </header>
</template>

<script>
export default {
  name: 'app-header',

  data () {
    return {}
  }
}
</script>

<style scoped>
#app-header {
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  left: 0;
  height: 4.5em;
  border-bottom: 1px solid #f5f5f5;
  padding-left: calc(100vw - 100%);
  background-color: rgba(255, 255, 255, .8);
}

.bloger-name {
  display: inline-block;
  margin: 0;
  line-height: 2.25;
  font-family: 'Agnes-Boldacb25b88f177d1';
  cursor: pointer;
}
</style>
