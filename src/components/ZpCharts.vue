<template>
  <div class="zp-charts-container">
    <div class="charts-canvas-container" :ref="chartRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { uuid } from '../util'
import { useAutoresize } from '../util/autoResize'
import * as echarts from 'echarts'
import 'echarts-liquidfill/src/liquidFill.js' //在这里引入

const instance = getCurrentInstance()

const resize = useAutoresize()

const id = uuid(false)
const chartRef = ref(`chart-${id}`)

let chart: any

let autoSwitchIntelval: any = []

const props = defineProps({
  option: {
    type: Object,
    default: null
  },
  callback: {
    type: Function,
    default: null
  },
  autoSwitch: {
    type: Array,
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

onUnmounted(() => {
  clearAutoSwitchIntelval()
})

const afterAutoResizeMixinInit = () => {
  initChart()
}
const initChart = () => {
  chart = echarts.init(instance?.refs[chartRef.value] as unknown as HTMLDivElement)

  if (!props.option) return

  chart.setOption(props.option)

  props.autoSwitch && autoSwitch()

  props.callback && props.callback(chart)
}

const onResize = () => {
  if (!chart) return
}

const autoSwitch = () => {
  const { option, autoSwitch } = props
  let indexs = new Array(autoSwitch.length).fill(0)
  autoSwitch.map((item: any, index: number) => {
    const { seriesIndex, timeout } = item

    let interval = setInterval(() => {
      console.log(123132)

      const length = option.series[seriesIndex].data.length
      if (indexs[index] < length) {
        chart.dispatchAction({ type: 'downplay', seriesIndex: seriesIndex })
        chart.dispatchAction({
          type: 'highlight',
          seriesIndex: seriesIndex,
          dataIndex: indexs[index]
        })
        chart.dispatchAction({
          type: 'showTip',
          seriesIndex: seriesIndex,
          dataIndex: indexs[index]
        })
        indexs[index]++
      } else {
        indexs[index] = 0
      }
    }, timeout)
    autoSwitchIntelval.push(interval)
  })
}

const clearAutoSwitchIntelval = () => {
  autoSwitchIntelval.map((item: any) => {
    clearInterval(item)
  })
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
