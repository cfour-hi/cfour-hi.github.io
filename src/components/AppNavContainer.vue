<template>
  <div id="app-nav-container">
    <div class="slider" :style="{ height: `${height}em`, transform: 'translateY(' + sliderTranslate + ')' }"></div>
    <app-nav :navs="navs" :height="height"></app-nav>
  </div>
</template>

<script>
import AppNav from './AppNav'

export default {
  name: 'app-nav-container',
  components: { AppNav },
  data () {
    return {
      height: 2.5,
      navs: this.$router.options.routes.filter(({ meta }) => meta && meta.nav),
    }
  },
  computed: {
    sliderTranslate () {
      const path = this.$route.path.match(/\/\w*/)[0]
      return `${this.navs.findIndex(nav => nav.path === path) * this.height}em`
    },
  },
}
</script>

<style scoped>
#app-nav-container {
  position: fixed;
  width: 10em;
}

.slider {
  position: absolute;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  transition: transform 0.3s;
}
</style>
