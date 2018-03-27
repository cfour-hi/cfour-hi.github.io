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
    visible: { type: Boolean, required: true },
    loading: { type: Boolean, required: true },
  },
}
</script>

<style scoped>
.load-more {
  margin-bottom: 1em;
  font-size: 14px;
  line-height: 2.5;
  text-align: center;
  color: #999;
  background-color: #fff;
  cursor: pointer;
}

.load-more:hover {
  color: #666;
  background-color: #e9e9e9;
}
</style>
