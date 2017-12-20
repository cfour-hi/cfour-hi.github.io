<template>
  <div id="app">
    <app-header></app-header>
    <app-main>
      <app-nav slot="app-nav"></app-nav>
    </app-main>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'
import AppMain from './components/AppMain'
import AppNav from './components/AppNav'

export default {
  name: 'app',

  components: { AppHeader, AppMain, AppNav },

  data () {
    return {

    }
  }
}
</script>

<style>
@import './assets/css/base.css';
</style>
