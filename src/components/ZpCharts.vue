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

let chart = ref()

const props = defineProps({
  option: {
    type: Object,
    default: null
  }
})

watch(
  () => props.option,
  (value) => {
    let option = {}
    if (value) option = value
    console.log(1111, option, chart.value)
    chart.value.setOption(option, true)
  }
)

onMounted(() => {
  // console.log(1111, instance?.refs)

  resize.then((data: any) => {
    data.autoResizeMixinInit(instance?.refs[chartRef.value], afterAutoResizeMixinInit, onResize)
  })
})

const afterAutoResizeMixinInit = () => {
  initChart()
}
const initChart = () => {
  chart.value = echarts.init(instance?.refs[chartRef.value] as unknown as HTMLDivElement)

  if (!props.option) return

  chart.value.setOption(props.option)
}

const onResize = () => {
  if (!chart) return
  // chart.value.resize()
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
