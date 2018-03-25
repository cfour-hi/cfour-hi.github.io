<template>
  <div id="home">
    <img src="https://avatars2.githubusercontent.com/u/8335856?s=460&v=4" alt="avator" class="avator">
    <h1 class="bloger-name">MONINE</h1>
    <div class="desc">Front-End Developer & JavaScript</div>
    <p><router-link to="/article">Blog</router-link></p>
    <p><a href="https://monine.github.io" target="_blank" rel="noopener noreferrer">Github</a></p>
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
</style>

<style>
#home a {
  position: relative;
  padding: 2px 5px;
  text-decoration: none;
}

#home a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid currentColor;
  transform: scaleX(0);
  transition: transform 0.15s ease-out;
}

#home a:hover::after {
  transform: scale(1);
}

#home p {
  margin: 0.2em;
  font-size: 14px;
  letter-spacing: 0.2em;
}
</style>

