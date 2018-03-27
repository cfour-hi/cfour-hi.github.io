<template>
  <div id="app-nav-container">
    <div class="slider" :style="{ height: `${height}em`, transform: 'translateY(' + sliderTranslate + ')' }"></div>
    <app-nav :navs="navs" :height="height"></app-nav>
  </div>
</template>

<script>
import AppNav from './AppNav'
import { navsRepo } from '@/config'

export default {
  name: 'app-nav-container',
  components: { AppNav },
  data () {
    return {
      height: 2.5,
      navs: Object.values(navsRepo),
    }
  },
  computed: {
    sliderTranslate () {
      const path = this.$route.path.match(/[^/]\w*/)[0]
      return `${this.navs.findIndex(nav => nav.name === path) * this.height}em`
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
  border-left: 5px solid #29f;
  background-color: #fff;
  transition: transform 0.15s ease-out;
  box-shadow: 0 15px 30px -15px rgba(0, 0, 0, 0.5);
}
</style>
