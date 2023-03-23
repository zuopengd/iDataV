<template>
  <div class="zp-digital-flop-enhanced" :style="style" :ref="iref">{{ num }}</div>
</template>
<script lang="ts" setup>
import { reactive, computed, watch, onMounted } from 'vue'
// 导入动画库
import gsap from 'gsap'

const props = defineProps({
  /**
   * 数字
   */
  num: {
    type: Number,
    default: 0
  },
  /**
   * 千位分割
   */
  kilobit: {
    type: Boolean,
    default: true
  },
  /**
   * 小数支持
   */
  decimal: {
    type: Boolean,
    default: false
  },

  /**
   * css配置
   */
  style: {
    type: Object,
    default: () => {}
  }
})

const iref = 'digital-flop-enhanced'

const data = reactive({
  num: 0
})

const num = computed(() => {
  let num = data.num
  if (!props.decimal) {
    num = Math.ceil(num)
  }
  // toLocaleString 千位分割
  return props.kilobit ? num.toLocaleString() : num
})

watch(
  () => props.num,
  (val) => {
    animation(val)
  }
)

onMounted(() => {
  animation(props.num)
})

const animation = (value: number) => {
  gsap.to(data, {
    num: value,
    duration: 0.5, // 动画时间 秒
    // ease: "power1.inOut", // 动画速率
    // repeat: 0, //重复次数
    // yoyo: false, // 往返运动
    // delay:2,//延迟2秒运动
    onStart() {
      // console.log('动画开始')
    },
    onComplete() {
      // console.log('动画完成')
    },
    onUpdate() {
      // console.log('属性更新')
    }
  })
}
</script>
<style lang="scss" scoped>
.zp-digital-flop-enhanced {
  // color: #fff;
  // overflow: hidden;
}
</style>
