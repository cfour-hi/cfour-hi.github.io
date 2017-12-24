<template>
  <nav id="app-nav" :style="{ lineHeight: height }">
    <router-link v-for="{ path, meta } of navs" :key="path" :to="path" class="nav-item">
      <i class="fa fa-fw" :class="meta.nav.icon"></i>{{ meta.nav.name }}
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'app-nav',

  props: {
    navs: { required: true, type: Array },
    height: { required: true, type: Number }
  },

  data () {
    return {}
  }
}
</script>

<style scoped>
#app-nav {
  position: relative;
  display: flex;
  flex-direction: column;
}

.nav-item {
  text-decoration: none;
  font-family: 'HoangYen11acb2198d6177d1';
  color: #5a5a5a;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #108ee9;
}

.nav-item .fa {
  margin-left: 1em;
  margin-right: .5em;
}
</style>
