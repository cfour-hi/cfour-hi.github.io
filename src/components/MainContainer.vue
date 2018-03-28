<template>
  <div id="main-container">
    <transition :duration="500" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in">
      <!-- <keep-alive :include="keepAliveComps"> -->
        <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>

<script>
import { keepAliveComps } from '../config'

export default {
  name: 'main-container',
  data () {
    return {
      keepAliveComps,
    }
  },
}
</script>

<style scoped>
#main-container {
  margin-left: 11em;
}
</style>
