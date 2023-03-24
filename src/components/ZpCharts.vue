<template>
  <div class="zp-charts-container">
    <div class="charts-canvas-container" :ref="chartRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, getCurrentInstance } from 'vue'
import { uuid } from '../util'
import { useAutoresize } from '../util/autoResize'
import * as echarts from 'echarts'
import 'echarts-liquidfill/src/liquidFill.js' //在这里引入

const instance = getCurrentInstance()

const resize = useAutoresize()

const id = uuid(false)
const chartRef = ref(`chart-${id}`)

let chart: any

const props = defineProps({
  option: {
    type: Object,
    default: null
  },
  callback: {
    type: Function,
    default: null
  }
})

watch(
  () => props.option,
  (value) => {
    if (chart) {
      let option = {}
      if (value) option = value
      chart.setOption(option, true)
    }
  }
)

onMounted(() => {
  resize.then((data: any) => {
    data.autoResizeMixinInit(instance?.refs[chartRef.value], afterAutoResizeMixinInit, onResize)
  })
})

const afterAutoResizeMixinInit = () => {
  initChart()
}
const initChart = () => {
  chart = echarts.init(instance?.refs[chartRef.value] as unknown as HTMLDivElement)

  if (!props.option) return

  chart.setOption(props.option)

  props.callback && props.callback(chart)
}

const onResize = () => {
  if (!chart) return
}
</script>

<style lang="scss" scoped>
.zp-charts-container {
  position: relative;
  width: 100%;
  height: 100%;

  .charts-canvas-container {
    width: 100%;
    height: 100%;
  }
}
</style>
