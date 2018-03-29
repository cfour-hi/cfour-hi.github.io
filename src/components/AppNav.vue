<template>
  <nav id="app-nav" :style="{ lineHeight: height }">
    <router-link v-for="nav of navs" :key="nav.name" :to="nav.route" :exact="nav.exact" class="nav-item">
      <i class="fa fa-fw" :class="nav.icon"></i>
      {{ nav.name }}
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'app-nav',
  props: {
    navs: { type: Array, required: true },
    height: { type: Number, required: true },
  },
}
</script>

<style scoped>
#app-nav {
  position: relative;
  display: flex;
  flex-direction: column;
}

.nav-item {
  text-transform: capitalize;
  text-decoration: none;
  font-family: "Lucida_Handwriting";
  color: #555;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #46bc99;
}

.nav-item .fa {
  margin-left: 1em;
  margin-right: 0.2em;
}
</style>
