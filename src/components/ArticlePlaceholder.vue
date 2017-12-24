<template>
  <article id="article-placeholder">
    <h2 class="title"></h2>
    <div class="meta"></div>
    <div>
      <i class="fa fa-quote-left fa-3x fa-pull-left fa-border" aria-hidden="true"></i>
      <blockquote class="quote">
        <p v-for="paragraph of 4" :key="paragraph" class="paragraph"></p>
      </blockquote>
    </div>
    <div class="hr"></div>
    <div class="body">
      <section v-for="section of 3" :key="section" class="body-section">
        <h3 class="title"></h3>
        <div class="body-content">
          <p v-for="paragraph of 5" :key="paragraph" class="paragraph"></p>
        </div>
      </section>
    </div>
  </article>
</template>

<script>
export default {
  name: 'article-placeholder',

  data () {
    return {}
  }
}
</script>

<style scoped>
#article-placeholder {
  padding: 2em;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.8);
}

.title {
  width: 50%;
  height: 1.2em;
  margin: 0 auto 1.5em;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.15);
}

.meta {
  width: 30%;
  font-size: 12px;
  height: 1em;
  margin: 0 auto 2em;
  background-color: rgba(0, 0, 0, 0.07);
}

.quote {
  padding-left: 3em;
}

.paragraph {
  height: 1em;
  border-radius: 0.5em;
  background-color: rgba(0, 0, 0, 0.1);
}

.paragraph:last-child {
  width: 70%;
}

.quote .paragraph:last-child {
  margin-left: -6em;
}

.hr {
  height: 3px;
  background-color: rgba(0, 0, 0, 0.03);
}

.body-section .title {
  width: 30%;
  margin: 1em 0;
  font-size: 18px;
  background-color: rgba(0, 0, 0, 0.13);
}
</style>
