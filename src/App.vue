<template>
  <div id="app">
    <app-header/>
    <main id="app-main">
      <app-nav-container/>
      <router-view/>
    </main>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'
import AppNavContainer from './components/AppNavContainer'

export default {
  name: 'app',

  components: { AppHeader, AppNavContainer }
}
</script>

<style scoped>
#app-main {
  width: 60em;
  margin: 5.5em auto 1em;
}
</style>


<style>
@import "./assets/css/base.css";
@import "./assets/css/app.css";
@import './assets/css/vs2015.css';
</style>
