<template>
  <div id="main-container">
    <transition name="fade" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
      <keep-alive :include="keepAliveComps">
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { keepAliveComps } from '../config'

export default {
  name: 'main-container',

  data () {
    return {
      keepAliveComps
    }
  }
}
</script>

<style scoped>
#main-container {
  margin-left: 11em;
}
</style>
