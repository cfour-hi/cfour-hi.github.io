<template>
  <div id="home">
    <img src="https://avatars2.githubusercontent.com/u/8335856?s=460&v=4" alt="avator" class="avator">
    <h1 class="bloger-name">MONINE</h1>
    <div class="desc">Front-End Developer & JavaScript</div>
    <div class="links">
      <router-link to="/article" class="hover-underline-animation">Blog</router-link>
      <a href="https://github.com/Monine" target="_blank" rel="noopener noreferrer" class="hover-underline-animation">Github</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
}
</script>

<style scoped>
#home {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 30em;
  margin-left: -15em;
  line-height: 1.5;
  text-align: center;
  color: #999;
  transform: translateY(-50%);
}

.avator {
  width: 10em;
  height: 10em;
  border-radius: 50%;
}

.bloger-name {
  margin-top: 0.15em;
  margin-bottom: 0.2em;
  font-size: 36px;
  font-family: "Agnes-Boldacb25b88f177d1";
  color: #333;
}

.pet-name {
  margin-top: 0;
  margin-bottom: 0.2em;
  font-size: 20px;
  color: #999;
}

.desc {
  margin-top: 0;
  margin-bottom: 1.2em;
  text-shadow: 0 2px #fff;
}

.links {
  width: 6em;
  margin: 0 auto;
}
</style>

<style>
#home .links a {
  display: inline-block;
  margin: 0.2em 0;
  font-size: 14px;
  letter-spacing: 0.2em;
}
</style>

