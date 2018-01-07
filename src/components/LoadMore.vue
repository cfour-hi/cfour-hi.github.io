<template>
  <div v-show="visible" class="load-more" @click="$emit('load')">
    <i v-show="loading" class="fa fa-spinner fa-spin fa-fw"></i>
    <span v-show="!loading">加载更多</span>
  </div>
</template>

<script>
export default {
  name: 'load-more',

  props: {
    visible: { required: true, type: Boolean },
    loading: { required: true, type: Boolean }
  }
}
</script>

<style scoped>
.load-more {
  margin-bottom: 1em;
  font-size: 14px;
  line-height: 2.5;
  text-align: center;
  color: #919191;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.load-more:hover {
  color: #5a5a5a;
  background-color: #e9e9e9;
}
</style>
