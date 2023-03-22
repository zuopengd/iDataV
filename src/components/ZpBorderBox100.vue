<template>
  <div class="border-box-100">
    <div class="title" v-if="title">{{ title }}</div>
    <div class="content" :style="contentStyle"><slot></slot></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

const contentStyle = computed(() => {
  return {
    height: props.title ? 'calc(100% - 40px)' : '100%'
  }
})

onMounted(() => {})
</script>

<style lang="scss" scoped>
.border-box-100 {
  width: 100%;
  height: 100%;
  border: 1px solid #272750;
  border-radius: 10px;
  background-color: #07052d;
  // border-color: red;
  > .title {
    font-size: 20px;
    line-height: 20px;
    color: #359bf2;
    border-left: 2px solid #4ca6ec;
    padding-left: 20px;
    margin-top: 20px;
  }
  > .content {
    width: 100%;
  }
}
</style>
