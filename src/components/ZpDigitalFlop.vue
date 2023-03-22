<template>
  <div class="zp-digital-flop" :style="boxStyle">
    <div class="number" :ref="iref" :style="numStyle">
      <template v-for="(item, index) in list" :key="index">
        <div
          class="li"
          :style="{
            marginTop: `-${mergedConfig.fontSize * parseInt(item)}px`,
            width: `${mergedConfig.fontSize * 0.58}px`
          }"
        >
          <div class="num">0</div>
          <div class="num">1</div>
          <div class="num">2</div>
          <div class="num">3</div>
          <div class="num">4</div>
          <div class="num">5</div>
          <div class="num">6</div>
          <div class="num">7</div>
          <div class="num">8</div>
          <div class="num">9</div>
        </div>
        <div
          v-if="(list.length - index) % 3 == 1 && list.length - index > 3"
          class="comma"
          :style="{ width: `${mergedConfig.fontSize * 0.33}px` }"
        >
          ,
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => {}
  }
})

const defaultConfig = {
  /**
   * 数字
   */
  num: 0,
  /**
   * 宽度
   */
  width: 500,
  /**
   * 字号
   */
  fontSize: 60,
  /**
   * 水平方向 left center right
   */
  textAlign: 'center',
  /**
   * 自定义样式
   */
  style: () => {}
}

const iref = 'digital-flop'

const mergedConfig = computed(() => {
  return { ...defaultConfig, ...props.config }
})

const list = computed(() => {
  return String(mergedConfig.value.num).split('')
})

const boxStyle = computed(() => {
  return {
    ...mergedConfig.value.style,
    width: `${mergedConfig.value.width}px`,
    height: `${mergedConfig.value.fontSize}px`,
    fontSize: `${mergedConfig.value.fontSize}px`
  }
})
const numStyle = computed(() => {
  const textAlign: any = { left: 'flex-start', center: 'center', right: 'flex-end' }
  return {
    // width: `${list.value.length * 45 + Math.floor(list.value.length / 3) * 20 + 40} px`
    height: `${mergedConfig.value.fontSize}px`,
    lineHeight: `${mergedConfig.value.fontSize}px`,
    justifyContent: textAlign[mergedConfig.value.textAlign]
  }
})

onMounted(() => {})
</script>
<style lang="scss" scoped>
.zp-digital-flop {
  color: #fff;

  /* 调整显示位置，可随意修改*/
  .number {
    overflow: hidden;
    margin: auto;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    .li {
      transition: margin-top 1s;
    }
  }
}
</style>
