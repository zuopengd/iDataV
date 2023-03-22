<template>
  <div
    id="zp-full-screen-container"
    class="zp-full-screen-container"
    :ref="fullScreenContainerRef"
    :style="style"
  >
    <template v-if="ready">
      <slot></slot>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useAutoresize } from '../util/autoResize'

const instance = getCurrentInstance()

const resize = useAutoresize()

// import autoResize from "@jiaminghi/data-view/src/mixin/autoResize.js";
const props = defineProps({
  width: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  },
  mode: {
    type: Number,
    default: 1 // 1 自适应宽度  2 自适应宽度及高度
  }
})
const fullScreenContainerRef = 'fullScreenContainer'
const iref = ref('full-screen-container')
const allWidth = ref(0)
const scale = ref(0)
const datavRoot = ref('')
const ready = ref(false)
const style = reactive({ width: '', height: '', transform: '' })

onMounted(() => {
  resize.then((data: any) => {
    data.autoResizeMixinInit(
      instance?.refs[fullScreenContainerRef],
      afterAutoResizeMixinInit,
      onResize
    )
  })
})

const afterAutoResizeMixinInit = () => {
  initConfig()

  setAppScale()

  ready.value = true
}
const initConfig = () => {
  allWidth.value = props.width

  style.width = `${props.width}px`
  style.height = `${props.height}px`
}
const setAppScale = () => {
  const currentWidth = document.body.clientWidth
  const { innerWidth, innerHeight } = window

  if (props.mode === 1) {
    style.transform = `scale(${currentWidth / props.width})`
  } else if (props.mode === 2) {
    style.transform = `scale(${innerWidth / props.width},${innerHeight / props.height})`
  }
}
const onResize = () => {
  setAppScale()
}
</script>

<style lang="scss" scoped>
#zp-full-screen-container {
  position: fixed;
  top: 0px;
  left: 0px;
  overflow: hidden;
  transform-origin: left top;
  z-index: 999;
  bottom: 0px;
  height: 100%;
}
</style>
