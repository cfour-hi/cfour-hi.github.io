<template>
  <div id="app">
    <app-header></app-header>
    <main id="app-main">
      <app-nav-container></app-nav-container>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'
import AppNavContainer from './components/AppNavContainer'

export default {
  name: 'app',
  components: { AppHeader, AppNavContainer },
}
</script>

<style scoped>
#app-main {
  width: 60em;
  margin: 5.5em auto 1em;
}
</style>


<style>
@import "./base.css";
@import "./app.css";
@import './vs2015.css';
</style>
